import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Frown, Loader2, Meh, Mic, RotateCcw, Save, Search, Smile } from 'lucide-react';
import {
  clearEditing,
  clearSuccessMessage,
  resetForm,
  saveCurrentInteraction,
  setSuccessMessage,
  toSnakeCaseInteraction,
  updateCurrentInteraction,
  updateFormField,
} from '../redux/interactionSlice';
import { meetingTypes } from '../data/mockData';

const inputClass =
  'w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/15';
const labelClass = 'mb-1 block text-sm font-semibold text-slate-700';

const sentimentOptions = [
  { value: 'Positive', icon: Smile, color: 'text-emerald-500' },
  { value: 'Neutral', icon: Meh, color: 'text-amber-500' },
  { value: 'Negative', icon: Frown, color: 'text-red-500' },
];

export default function InteractionForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { form, editingId, successMessage } = useSelector((state) => state.interaction);
  const { form: isSubmitting } = useSelector((state) => state.loading);
  const formError = useSelector((state) => state.errors.form);
  const setField = (field, value) => dispatch(updateFormField({ field, value }));
  const handleChange = (field) => (event) => setField(field, event.target.value);

  const handleSave = async (event) => {
    event.preventDefault();
    const payload = toSnakeCaseInteraction(form);
    const wasEditing = Boolean(editingId);
    const action = editingId
      ? await dispatch(updateCurrentInteraction({ interactionId: editingId, payload }))
      : await dispatch(saveCurrentInteraction(payload));

    if (saveCurrentInteraction.fulfilled.match(action) || updateCurrentInteraction.fulfilled.match(action)) {
      dispatch(clearEditing());
      dispatch(resetForm());
      dispatch(setSuccessMessage(wasEditing ? 'Interaction updated successfully.' : 'Interaction saved successfully.'));
      navigate('/');
    }
  };

  return (
    <section id="interaction-form" className="flex h-[calc(100vh-8.5rem)] min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <header className="border-b border-slate-100 px-4 py-3">
        <h1 className="text-xl font-semibold text-slate-800">{editingId ? 'Edit HCP Interaction' : 'Log HCP Interaction'}</h1>
      </header>
      <form onSubmit={handleSave} className="scrollbar-thin flex-1 space-y-5 overflow-y-auto px-4 py-4">
        {successMessage && <div className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{successMessage}</div>}
        {formError && <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</div>}
        <div>
          <p className="mb-1 text-sm font-semibold text-slate-700">Interaction Details</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            <div><label htmlFor="doctorName" className={labelClass}>HCP Name</label><input id="doctorName" type="text" value={form.doctorName} onChange={handleChange('doctorName')} placeholder="Search or select HCP..." className={inputClass} required /></div>
            <div><label htmlFor="meetingType" className={labelClass}>Interaction Type</label><select id="meetingType" value={form.meetingType} onChange={handleChange('meetingType')} className={inputClass} required><option value="Meeting">Meeting</option>{meetingTypes.filter((type) => type !== 'Meeting').map((type) => <option key={type} value={type}>{type}</option>)}</select></div>
            <div><label htmlFor="meetingDate" className={labelClass}>Date</label><input id="meetingDate" type="date" value={form.meetingDate} onChange={handleChange('meetingDate')} className={inputClass} required /></div>
            <div><label htmlFor="meetingTime" className={labelClass}>Time</label><input id="meetingTime" type="time" value={form.meetingTime || ''} onChange={handleChange('meetingTime')} className={inputClass} /></div>
          </div>
        </div>
        <div><label htmlFor="attendees" className={labelClass}>Attendees</label><input id="attendees" type="text" value={(form.attendees || []).join(', ')} onChange={(event) => setField('attendees', event.target.value.split(',').map((name) => name.trim()).filter(Boolean))} placeholder="Enter names or search..." className={inputClass} /></div>
        <div><label htmlFor="discussionNotes" className={labelClass}>Topics Discussed</label><textarea id="discussionNotes" value={form.discussionNotes} onChange={handleChange('discussionNotes')} rows={3} placeholder="Enter key discussion points..." className={`${inputClass} resize-y`} /><button type="button" className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"><Mic className="h-3 w-3" /> Summarize from Voice Note (Requires Consent)</button></div>
        <div>
          <p className={labelClass}>Materials Shared / Samples Distributed</p>
          <label htmlFor="materialsShared" className="mb-2 block text-sm font-semibold text-slate-700">Materials Shared</label><input id="materialsShared" type="text" value={(form.materialsShared || []).join(', ')} onChange={(event) => setField('materialsShared', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="Search or add materials..." className={inputClass} />
          {!form.materialsShared?.length && <p className="mt-3 text-sm text-slate-400">No materials added.</p>}
          <label htmlFor="samplesDistributed" className="mb-2 mt-4 block text-sm font-semibold text-slate-700">Samples Distributed</label><input id="samplesDistributed" type="text" value={(form.samplesDistributed || []).join(', ')} onChange={(event) => setField('samplesDistributed', event.target.value.split(',').map((item) => item.trim()).filter(Boolean))} placeholder="Search or add samples..." className={inputClass} />
        </div>

        {/* Observed/Inferred HCP Sentiment */}
        <div>
          <p className={labelClass}>Observed/Inferred HCP Sentiment</p>
          <div className="flex items-center gap-6">
            {sentimentOptions.map(({ value, icon: Icon, color }) => (
              <label key={value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                <input
                  type="radio"
                  name="sentiment"
                  value={value}
                  checked={form.sentiment === value}
                  onChange={handleChange('sentiment')}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <Icon className={`h-4 w-4 ${form.sentiment === value ? color : 'text-slate-300'}`} />
                {value}
              </label>
            ))}
          </div>
        </div>

        {/* Outcomes */}
        <div>
          <label htmlFor="outcomes" className={labelClass}>Outcomes</label>
          <textarea
            id="outcomes"
            value={form.outcomes || ''}
            onChange={handleChange('outcomes')}
            rows={2}
            placeholder="Key outcomes or agreements..."
            className={`${inputClass} resize-y`}
          />
        </div>

        {/* Follow-up Actions */}
        <div>
          <label htmlFor="followUpActions" className={labelClass}>Follow-up Actions</label>
          <textarea
            id="followUpActions"
            value={form.followUpActions || ''}
            onChange={handleChange('followUpActions')}
            rows={2}
            placeholder="Enter next steps or tasks..."
            className={`${inputClass} resize-y`}
          />
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 pt-4"><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60">{isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{editingId ? 'Update' : 'Save Interaction'}</button><button type="button" onClick={() => { dispatch(clearSuccessMessage()); dispatch(resetForm()); }} className="inline-flex items-center gap-2 rounded-md border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"><RotateCcw className="h-4 w-4" /> Reset</button><Search className="ml-auto h-4 w-4 text-slate-400" aria-hidden="true" /></div>
      </form>
    </section>
  );
}