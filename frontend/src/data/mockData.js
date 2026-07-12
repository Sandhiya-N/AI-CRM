export const doctors = [
  {
    id: 'doc-001',
    name: 'Dr. Priya Sharma',
    hospital: 'Apollo Hospitals, Chennai',
    specialization: 'Cardiology',
    email: 'priya.sharma@apollo.in',
    phone: '+91 98400 12345',
  },
  {
    id: 'doc-002',
    name: 'Dr. Rajesh Menon',
    hospital: 'Fortis Healthcare, Bengaluru',
    specialization: 'Neurology',
    email: 'rajesh.menon@fortis.in',
    phone: '+91 98765 43210',
  },
  {
    id: 'doc-003',
    name: 'Dr. Ananya Patel',
    hospital: 'Max Super Speciality, Delhi',
    specialization: 'Endocrinology',
    email: 'ananya.patel@max.in',
    phone: '+91 98100 55667',
  },
  {
    id: 'doc-004',
    name: 'Dr. Vikram Singh',
    hospital: 'AIIMS, New Delhi',
    specialization: 'Oncology',
    email: 'vikram.singh@aiims.in',
    phone: '+91 98990 11223',
  },
  {
    id: 'doc-005',
    name: 'Dr. Meera Krishnan',
    hospital: 'KIMS, Hyderabad',
    specialization: 'Rheumatology',
    email: 'meera.krishnan@kims.in',
    phone: '+91 97000 33445',
  },
  {
    id: 'doc-006',
    name: 'Dr. Arjun Desai',
    hospital: 'Lilavati Hospital, Mumbai',
    specialization: 'Gastroenterology',
    email: 'arjun.desai@lilavati.in',
    phone: '+91 98200 77889',
  },
];

export const meetingTypes = [
  'Meeting',
  'Call',
  'Email',
  'In-Person Visit',
  'Virtual Meeting',
  'Conference',
  'Hospital Round',
  'Lunch Meeting',
];

export const priorities = ['Low', 'Medium', 'High', 'Urgent'];

export const statuses = ['Scheduled', 'Completed', 'Follow-up', 'Cancelled'];

export const products = [
  'CardioMax 10mg',
  'NeuroRelief XR',
  'GlucoBalance',
  'OncoShield IV',
  'RheumaEase',
  'GastroPro',
];

export const initialInteractions = [
  {
    id: 'int-001',
    doctorName: 'Dr. Priya Sharma',
    hospital: 'Apollo Hospitals, Chennai',
    specialization: 'Cardiology',
    meetingDate: '2026-03-15',
    meetingType: 'In-Person Visit',
    productsDiscussed: ['CardioMax 10mg', 'NeuroRelief XR'],
    discussionNotes:
      'Discussed latest clinical trial data for CardioMax. Dr. Sharma expressed interest in prescribing for hypertensive patients with comorbid anxiety.',
    doctorFeedback:
      'Positive reception. Requested patient education materials and sample packs for clinic.',
    followUpDate: '2026-04-01',
    priority: 'High',
    nextAction: 'Deliver samples and arrange CME session on cardiovascular risk management.',
    summary: 'Strong interest in CardioMax; follow-up CME scheduled.',
    status: 'Follow-up',
  },
  {
    id: 'int-002',
    doctorName: 'Dr. Rajesh Menon',
    hospital: 'Fortis Healthcare, Bengaluru',
    specialization: 'Neurology',
    meetingDate: '2026-03-10',
    meetingType: 'Virtual Meeting',
    productsDiscussed: ['NeuroRelief XR'],
    discussionNotes:
      'Reviewed efficacy data for migraine prophylaxis. Compared with current first-line therapies in his practice.',
    doctorFeedback:
      'Cautiously optimistic. Wants to review peer-reviewed publications before adopting.',
    followUpDate: '2026-03-28',
    priority: 'Medium',
    nextAction: 'Send published journal articles and arrange peer discussion with KOL.',
    summary: 'Awaiting literature review; publications to be shared.',
    status: 'Follow-up',
  },
  {
    id: 'int-003',
    doctorName: 'Dr. Ananya Patel',
    hospital: 'Max Super Speciality, Delhi',
    specialization: 'Endocrinology',
    meetingDate: '2026-03-08',
    meetingType: 'Hospital Round',
    productsDiscussed: ['GlucoBalance'],
    discussionNotes:
      'Presented HbA1c reduction data from Phase III trials. Discussed insulin-sparing benefits for Type 2 diabetes patients.',
    doctorFeedback:
      'Very interested. Already has 3 patients who may benefit. Asked about formulary inclusion timeline.',
    followUpDate: '2026-03-20',
    priority: 'High',
    nextAction: 'Coordinate with hospital pharmacy committee for formulary review.',
    summary: 'High prescribing intent; formulary submission initiated.',
    status: 'Completed',
  },
  {
    id: 'int-004',
    doctorName: 'Dr. Vikram Singh',
    hospital: 'AIIMS, New Delhi',
    specialization: 'Oncology',
    meetingDate: '2026-03-05',
    meetingType: 'Conference',
    productsDiscussed: ['OncoShield IV'],
    discussionNotes:
      'Met at ASCO India symposium. Brief discussion on immunotherapy combination protocols and safety profile.',
    doctorFeedback:
      'Interested in investigator-initiated trial collaboration. Requested full protocol documentation.',
    followUpDate: '2026-04-15',
    priority: 'Urgent',
    nextAction: 'Connect with medical affairs for IIT proposal and schedule follow-up call.',
    summary: 'IIT collaboration opportunity; medical affairs engagement needed.',
    status: 'Scheduled',
  },
  {
    id: 'int-005',
    doctorName: 'Dr. Meera Krishnan',
    hospital: 'KIMS, Hyderabad',
    specialization: 'Rheumatology',
    meetingDate: '2026-02-28',
    meetingType: 'Lunch Meeting',
    productsDiscussed: ['RheumaEase'],
    discussionNotes:
      'Discussed biologic switching data for RA patients. Covered injection training and patient support programs.',
    doctorFeedback:
      'Satisfied with safety data. Concerned about patient affordability and insurance coverage.',
    followUpDate: '2026-03-18',
    priority: 'Medium',
    nextAction: 'Provide patient assistance program details and reimbursement support contacts.',
    summary: 'Product accepted; affordability support materials required.',
    status: 'Completed',
  },
  {
    id: 'int-006',
    doctorName: 'Dr. Arjun Desai',
    hospital: 'Lilavati Hospital, Mumbai',
    specialization: 'Gastroenterology',
    meetingDate: '2026-02-22',
    meetingType: 'In-Person Visit',
    productsDiscussed: ['GastroPro'],
    discussionNotes:
      'Reviewed PPI-sparing approach for GERD management. Demonstrated new sustained-release formulation benefits.',
    doctorFeedback:
      'Prefers existing brand. Open to trial in refractory cases only.',
    followUpDate: '2026-04-10',
    priority: 'Low',
    nextAction: 'Share case studies on refractory GERD and offer trial samples for select patients.',
    summary: 'Limited initial uptake; targeted refractory case approach.',
    status: 'Follow-up',
  },
  {
    id: 'int-007',
    doctorName: 'Dr. Priya Sharma',
    hospital: 'Apollo Hospitals, Chennai',
    specialization: 'Cardiology',
    meetingDate: '2026-02-15',
    meetingType: 'Virtual Meeting',
    productsDiscussed: ['CardioMax 10mg'],
    discussionNotes:
      'Follow-up on previous visit. Discussed real-world evidence from European markets and Indian sub-group analysis.',
    doctorFeedback: 'Ready to initiate prescribing for 5 patients in the coming week.',
    followUpDate: '2026-03-01',
    priority: 'High',
    nextAction: 'Confirm sample delivery and schedule first prescription tracking call.',
    summary: 'Prescribing initiated; monitoring first cohort outcomes.',
    status: 'Completed',
  },
  {
    id: 'int-008',
    doctorName: 'Dr. Ananya Patel',
    hospital: 'Max Super Speciality, Delhi',
    specialization: 'Endocrinology',
    meetingDate: '2026-02-10',
    meetingType: 'In-Person Visit',
    productsDiscussed: ['GlucoBalance', 'CardioMax 10mg'],
    discussionNotes:
      'Discussed cardiometabolic syndrome management. Presented combination therapy rationale for diabetic patients with CVD risk.',
    doctorFeedback:
      'Excellent presentation. Wants joint session with cardiology department.',
    followUpDate: '2026-03-25',
    priority: 'High',
    nextAction: 'Organize interdisciplinary CME with cardiology and endocrinology teams.',
    summary: 'Cross-specialty CME planned; strong engagement.',
    status: 'Scheduled',
  },
];

export const initialChatMessages = [
  {
    id: 'msg-001',
    role: 'assistant',
    content:
      'Log interaction details here (e.g., "Met Dr. Smith, discussed Product-X efficacy, positive sentiment, shared brochure") or ask for help.',
    timestamp: '2026-03-15T09:00:00',
  },
];

export const aiDummyResponses = [
  'I\'ve noted your interaction with Dr. Sharma. Based on the discussion about CardioMax, I recommend scheduling a follow-up CME session within 2 weeks. Would you like me to draft a follow-up email?',
  'Great! I\'ve captured the meeting details. The priority should be set to High given the doctor\'s prescribing intent. Shall I add this to your interaction history?',
  'Based on your notes, here\'s a suggested summary: "Positive engagement on NeuroRelief XR efficacy data. Doctor requested peer-reviewed publications before adoption." Would you like to save this?',
  'I can help structure that interaction. For a virtual meeting with a neurologist, I suggest highlighting clinical trial endpoints and safety profile. What products were discussed?',
  'Your follow-up action items look good. I\'ve identified 2 pending tasks from this week: sample delivery to Apollo Chennai and formulary submission at Max Delhi. Need a priority ranking?',
  'I\'ve analyzed your interaction history. You have 3 high-priority follow-ups due this week. Dr. Vikram Singh\'s IIT collaboration request is marked urgent. Shall I prepare talking points?',
];

export const emptyInteractionForm = {
  doctorName: '',
  hospital: '',
  specialization: '',
  meetingDate: new Date().toISOString().slice(0, 10),
  meetingTime: new Date().toTimeString().slice(0, 5),
  meetingType: 'Meeting',
  attendees: [],
  productsDiscussed: [],
  discussionNotes: '',
  materialsShared: [],
  doctorFeedback: '',
  followUpDate: '',
  priority: 'Medium',
  nextAction: '',
};

export const currentUser = {
  name: 'User',
  role: 'Medical Representative',
  territory: 'South India',
  avatar: null,
};

export const notifications = [
  {
    id: 'notif-001',
    title: 'Follow-up Due',
    message: 'Dr. Priya Sharma follow-up scheduled for tomorrow.',
    time: '2h ago',
    read: false,
  },
  {
    id: 'notif-002',
    title: 'Sample Delivery',
    message: 'CardioMax samples delivered to Apollo Chennai.',
    time: '5h ago',
    read: false,
  },
  {
    id: 'notif-003',
    title: 'CME Reminder',
    message: 'Interdisciplinary CME at Max Delhi on Mar 25.',
    time: '1d ago',
    read: true,
  },
];
