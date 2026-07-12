import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { sendChat } from '../api/api';
import { initialChatMessages } from '../data/mockData';
import { applyExtractedData } from './interactionSlice';
import { setLoading } from './loadingSlice';
import { extractInteractionLocally } from '../utils/localInteractionExtraction';

const initialState = {
  messages: initialChatMessages,
  input: '',
  isTyping: false,
  aiResponse: null,
};

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (message, { dispatch }) => {
    dispatch(setLoading({ key: 'chat', value: true }));

    try {
      const response = await sendChat(message);
      const extractedPayload =
        response?.extracted_data || response?.data?.extracted_data || response?.data || {};

      if (Object.keys(extractedPayload).length > 0) {
        dispatch(applyExtractedData(extractedPayload));
      }

      return response;
    } catch {
      const extracted_data = extractInteractionLocally(message);
      dispatch(applyExtractedData(extracted_data));
      return {
        reply: 'I filled the interaction form from your message. Review the details, then save the interaction.',
        extracted_data,
        localFallback: true,
      };
    } finally {
      dispatch(setLoading({ key: 'chat', value: false }));
    }
  },
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChatInput: (state, action) => {
      state.input = action.payload;
    },
    sendUserMessage: (state, action) => {
      const content = action.payload.trim();
      if (!content) return;

      state.messages.push({
        id: nanoid(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      });
      state.input = '';
      state.isTyping = true;
      state.aiResponse = null;
    },
    receiveAiMessage: (state, action) => {
      state.messages.push({
        id: nanoid(),
        role: 'assistant',
        content: action.payload,
        timestamp: new Date().toISOString(),
      });
      state.isTyping = false;
    },
    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },
    clearChat: (state) => {
      state.messages = [...initialChatMessages];
      state.input = '';
      state.isTyping = false;
      state.aiResponse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendChatMessage.pending, (state) => {
        state.isTyping = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.aiResponse = action.payload;
        state.messages.push({
          id: nanoid(),
          role: 'assistant',
          content:
            action.payload?.reply ||
            action.payload?.message ||
            'I extracted the interaction details and auto-filled the form.',
          timestamp: new Date().toISOString(),
        });
        state.isTyping = false;
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isTyping = false;
        const errorMessage = action.payload || 'Unable to process the conversation.';
        const isConnectionError = /network error|failed to fetch|connect/i.test(errorMessage);
        state.messages.push({
          id: nanoid(),
          role: 'assistant',
          content: isConnectionError
            ? 'I cannot reach the AI server. Start the backend on port 8000, then send your message again.'
            : `I could not process that message: ${errorMessage}`,
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const {
  setChatInput,
  sendUserMessage,
  receiveAiMessage,
  setTyping,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
