import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { getHistory } from '../api/api';
import { initialInteractions } from '../data/mockData';
import { setLoading } from './loadingSlice';
import { setError } from './errorsSlice';

const ITEMS_PER_PAGE = 5;

const normalizeHistoryInteraction = (interaction = {}) => ({
  id: interaction.id ?? nanoid(),
  doctorName: interaction.doctor_name || interaction.doctorName || '',
  hospital: interaction.hospital || '',
  specialization: interaction.specialization || '',
  meetingDate: interaction.meeting_date || interaction.meetingDate || '',
  meetingType: interaction.interaction_type || interaction.meetingType || '',
  productsDiscussed: Array.isArray(interaction.products_discussed)
    ? interaction.products_discussed.filter(Boolean)
    : Array.isArray(interaction.productsDiscussed)
      ? interaction.productsDiscussed.filter(Boolean)
      : [],
  discussionNotes:
    interaction.discussion_summary || interaction.discussionNotes || '',
  doctorFeedback: interaction.outcomes || interaction.doctorFeedback || '',
  followUpDate: interaction.follow_up_date || interaction.followUpDate || '',
  priority: interaction.priority || 'Medium',
  nextAction: interaction.next_action || interaction.nextAction || '',
  summary:
    interaction.summary ||
    interaction.discussion_summary ||
    interaction.discussionNotes ||
    '',
  status: interaction.status || 'Completed',
});

const initialState = {
  interactions: initialInteractions,
  searchQuery: '',
  statusFilter: 'All',
  priorityFilter: 'All',
  currentPage: 1,
  itemsPerPage: ITEMS_PER_PAGE,
  sortField: 'meetingDate',
  sortDirection: 'desc',
};

export const loadHistory = createAsyncThunk(
  'history/loadHistory',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(setLoading({ key: 'history', value: true }));

    try {
      const response = await getHistory();
      return response;
    } catch (error) {
      dispatch(setError({ key: 'history', value: error.message }));
      return rejectWithValue(error.message);
    } finally {
      dispatch(setLoading({ key: 'history', value: false }));
    }
  },
);

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addInteraction: (state, action) => {
      state.interactions.unshift(normalizeHistoryInteraction(action.payload));
      state.currentPage = 1;
    },
    updateInteraction: (state, action) => {
      const normalized = normalizeHistoryInteraction(action.payload);
      const index = state.interactions.findIndex(
        (item) => item.id === normalized.id,
      );
      if (index !== -1) {
        state.interactions[index] = normalized;
      }
    },
    deleteInteraction: (state, action) => {
      state.interactions = state.interactions.filter(
        (item) => item.id !== action.payload,
      );
      const totalPages = Math.ceil(
        state.interactions.length / state.itemsPerPage,
      );
      if (state.currentPage > totalPages && totalPages > 0) {
        state.currentPage = totalPages;
      }
    },
    setInteractions: (state, action) => {
      state.interactions = action.payload.map((item) =>
        normalizeHistoryInteraction(item),
      );
      state.currentPage = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setPriorityFilter: (state, action) => {
      state.priorityFilter = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSort: (state, action) => {
      const { field, direction } = action.payload;
      state.sortField = field;
      state.sortDirection = direction;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadHistory.fulfilled, (state, action) => {
        state.interactions = action.payload.map((item) =>
          normalizeHistoryInteraction(item),
        );
      })
      .addCase(loadHistory.rejected, (state) => {
        state.interactions = [...initialInteractions];
      });
  },
});

export const {
  addInteraction,
  updateInteraction,
  deleteInteraction,
  setInteractions,
  setSearchQuery,
  setStatusFilter,
  setPriorityFilter,
  setCurrentPage,
  setSort,
} = historySlice.actions;

export const selectFilteredInteractions = (state) => {
  const {
    interactions,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortField,
    sortDirection,
  } = state.history;

  let filtered = [...interactions];

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.doctorName.toLowerCase().includes(query) ||
        item.hospital.toLowerCase().includes(query) ||
        item.productsDiscussed.some((p) => p.toLowerCase().includes(query)) ||
        item.summary.toLowerCase().includes(query),
    );
  }

  if (statusFilter !== 'All') {
    filtered = filtered.filter((item) => item.status === statusFilter);
  }

  if (priorityFilter !== 'All') {
    filtered = filtered.filter((item) => item.priority === priorityFilter);
  }

  filtered.sort((a, b) => {
    const aVal = a[sortField] ?? '';
    const bVal = b[sortField] ?? '';
    const comparison = String(aVal).localeCompare(String(bVal));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return filtered;
};

export const selectPaginatedInteractions = (state) => {
  const filtered = selectFilteredInteractions(state);
  const { currentPage, itemsPerPage } = state.history;
  const start = (currentPage - 1) * itemsPerPage;
  return filtered.slice(start, start + itemsPerPage);
};

export const selectTotalPages = (state) => {
  const filtered = selectFilteredInteractions(state);
  return Math.max(1, Math.ceil(filtered.length / state.history.itemsPerPage));
};

export const selectFilteredCount = (state) =>
  selectFilteredInteractions(state).length;

export { nanoid };
export default historySlice.reducer;
