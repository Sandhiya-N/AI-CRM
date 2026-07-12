import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { editInteraction, saveInteraction } from '../api/api';
import { doctors, emptyInteractionForm } from '../data/mockData';
import { addInteraction, updateInteraction } from './historySlice';
import { setLoading } from './loadingSlice';
import { setError } from './errorsSlice';

const buildDoctorFeedback = (payload = {}) => {
  const parts = [payload.hcp_sentiment, payload.outcomes].filter(Boolean);
  return parts.join(' • ');
};

const getDoctorMeta = (doctorName) => {
  const match = doctors.find(
    (doctor) => doctor.name.toLowerCase() === doctorName.toLowerCase(),
  );

  return match
    ? {
        hospital: match.hospital,
        specialization: match.specialization,
      }
    : {};
};

export const normalizeInteractionForm = (payload = {}) => {
  const doctorName =
    payload.hcp_name || payload.doctor_name || payload.doctorName || '';
  const followUpActions = Array.isArray(payload.follow_up_actions)
    ? payload.follow_up_actions.filter(Boolean)
    : [];
  const productsDiscussed = Array.isArray(payload.products_discussed)
    ? payload.products_discussed.filter(Boolean)
    : Array.isArray(payload.productsDiscussed)
      ? payload.productsDiscussed.filter(Boolean)
      : [];
  const doctorMeta = getDoctorMeta(doctorName);

  return {
    doctorName,
    hospital: payload.hospital || doctorMeta.hospital || '',
    specialization: payload.specialization || doctorMeta.specialization || '',
    meetingDate: payload.date || payload.meeting_date || payload.meetingDate || '',
    meetingType: payload.interaction_type || payload.meetingType || '',
    productsDiscussed,
    discussionNotes:
      payload.topics_discussed || payload.discussion_summary || payload.discussionNotes || '',
    doctorFeedback: buildDoctorFeedback(payload) || payload.doctorFeedback || '',
    followUpDate: payload.follow_up_date || payload.followUpDate || '',
    priority: payload.priority || 'Medium',
    nextAction: followUpActions.join(', ') || payload.nextAction || '',
    meetingTime: payload.time || payload.meeting_time || payload.meetingTime || '',
    attendees: Array.isArray(payload.attendees) ? payload.attendees : [],
    materialsShared: Array.isArray(payload.materials_shared)
      ? payload.materials_shared
      : [],
    samplesDistributed: Array.isArray(payload.samples_distributed)
      ? payload.samples_distributed
      : [],
    hcpSentiment: payload.hcp_sentiment || '',
    outcomes: payload.outcomes || '',
  };
};

export const toSnakeCaseInteraction = (form = {}) => ({
  doctor_name: form.doctorName?.trim() || null,
  hospital: form.hospital?.trim() || null,
  specialization: form.specialization?.trim() || null,
  meeting_date: form.meetingDate || null,
  meeting_time: form.meetingTime || null,
  interaction_type: form.meetingType || null,
  attendees: Array.isArray(form.attendees)
    ? form.attendees.filter(Boolean)
    : form.doctorName
      ? [form.doctorName.trim()]
      : [],
  products_discussed: Array.isArray(form.productsDiscussed)
    ? form.productsDiscussed.filter(Boolean)
    : [],
  discussion_summary: form.discussionNotes?.trim() || null,
  materials_shared: Array.isArray(form.materialsShared)
    ? form.materialsShared.filter(Boolean)
    : [],
  samples_distributed: Array.isArray(form.samplesDistributed)
    ? form.samplesDistributed.filter(Boolean)
    : [],
  hcp_sentiment: form.hcpSentiment?.trim() || null,
  outcomes: form.outcomes?.trim() || form.doctorFeedback?.trim() || null,
  follow_up_actions: form.nextAction?.trim()
    ? [form.nextAction.trim()]
    : [],
  follow_up_date: form.followUpDate || null,
  priority: form.priority || 'Medium',
  next_action: form.nextAction?.trim() || null,
});

const initialState = {
  form: { ...emptyInteractionForm },
  editingId: null,
  isFormDirty: false,
  successMessage: null,
};

export const saveCurrentInteraction = createAsyncThunk(
  'interaction/saveCurrentInteraction',
  async (payload, { dispatch }) => {
    dispatch(setLoading({ key: 'form', value: true }));

    try {
      const response = await saveInteraction(payload);
      dispatch(addInteraction(response));
      return response;
    } catch {
      // Keep the complete log-and-dashboard flow usable for a local demo when
      // the optional API server is not running on port 8000.
      const localInteraction = {
        ...payload,
        id: `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      dispatch(addInteraction(localInteraction));
      dispatch(setError({ key: 'form', value: null }));
      return localInteraction;
    } finally {
      dispatch(setLoading({ key: 'form', value: false }));
    }
  },
);

export const updateCurrentInteraction = createAsyncThunk(
  'interaction/updateCurrentInteraction',
  async ({ interactionId, payload }, { dispatch, rejectWithValue }) => {
    dispatch(setLoading({ key: 'form', value: true }));

    try {
      const response = await editInteraction(interactionId, payload);
      dispatch(updateInteraction(response));
      return response;
    } catch (error) {
      dispatch(setError({ key: 'form', value: error.message }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading({ key: 'form', value: false }));
    }
  },
);

const interactionSlice = createSlice({
  name: 'interaction',
  initialState,
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
      state.isFormDirty = true;
    },
    setFormData: (state, action) => {
      state.form = {
        ...emptyInteractionForm,
        ...normalizeInteractionForm(action.payload),
      };
      state.isFormDirty = true;
    },
    applyExtractedData: (state, action) => {
      const payload = action.payload || {};
      const normalized = normalizeInteractionForm(payload);
      const fieldSources = {
        doctorName: ['hcp_name', 'doctor_name', 'doctorName'],
        hospital: ['hospital'],
        specialization: ['specialization'],
        meetingDate: ['date', 'meeting_date', 'meetingDate'],
        meetingTime: ['time', 'meeting_time', 'meetingTime'],
        meetingType: ['interaction_type', 'meetingType'],
        attendees: ['attendees'],
        productsDiscussed: ['products_discussed', 'productsDiscussed'],
        discussionNotes: ['topics_discussed', 'discussion_summary', 'discussionNotes'],
        materialsShared: ['materials_shared'],
        samplesDistributed: ['samples_distributed'],
        hcpSentiment: ['hcp_sentiment'],
        outcomes: ['outcomes'],
        followUpDate: ['follow_up_date', 'followUpDate'],
        priority: ['priority'],
        nextAction: ['next_action', 'nextAction', 'follow_up_actions'],
      };

      Object.entries(fieldSources).forEach(([field, sources]) => {
        if (sources.some((source) => payload[source] !== undefined && payload[source] !== null)) {
          state.form[field] = normalized[field];
        }
      });
      state.isFormDirty = true;
    },
    resetForm: (state) => {
      state.form = { ...emptyInteractionForm };
      state.editingId = null;
      state.isFormDirty = false;
    },
    setEditingInteraction: (state, action) => {
      const interaction = normalizeInteractionForm(action.payload);
      state.form = {
        ...emptyInteractionForm,
        ...interaction,
      };
      state.editingId = action.payload.id;
      state.isFormDirty = false;
    },
    clearEditing: (state) => {
      state.editingId = null;
    },
    toggleProduct: (state, action) => {
      const product = action.payload;
      const index = state.form.productsDiscussed.indexOf(product);
      if (index === -1) {
        state.form.productsDiscussed.push(product);
      } else {
        state.form.productsDiscussed.splice(index, 1);
      }
      state.isFormDirty = true;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
});

export const {
  updateFormField,
  setFormData,
  applyExtractedData,
  resetForm,
  setEditingInteraction,
  clearEditing,
  toggleProduct,
  setSuccessMessage,
  clearSuccessMessage,
} = interactionSlice.actions;

export default interactionSlice.reducer;
