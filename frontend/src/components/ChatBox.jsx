import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Send, Sparkles } from 'lucide-react';
import ChatMessage from './ChatMessage';
import {
  setChatInput,
  sendUserMessage,
  sendChatMessage,
} from '../redux/chatSlice';

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-primary-600">
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="inline-flex items-center gap-1 rounded-2xl rounded-tl-sm border border-slate-100 bg-white px-4 py-3 shadow-sm">
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
      </div>
    </div>
  );
}

export default function ChatBox() {
  const dispatch = useDispatch();
  const { messages, input, isTyping } = useSelector((state) => state.chat);
  const { chat: isChatLoading } = useSelector((state) => state.loading);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isPending = isTyping || isChatLoading;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPending]);

  const handleSend = () => {
    const content = input.trim();
    if (!content || isPending) return;

    dispatch(sendUserMessage(content));
    dispatch(sendChatMessage(content));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-primary-600" />
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              AI Assistant
            </h3>
            <p className="text-xs text-slate-500">
              Log interaction details here via chat
            </p>
          </div>
        </div>
      </div>

      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isPending && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-100 p-3">
        <div className="flex items-end gap-2 rounded-xl border border-slate-200 bg-white p-1 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-500/20">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => dispatch(setChatInput(e.target.value))}
            onKeyDown={handleKeyDown}
            placeholder="Describe Interaction..."
            rows={1}
            className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isPending}
            className="flex h-11 shrink-0 items-center gap-1 rounded-xl bg-primary-600 px-3 text-xs font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            title="Log conversation"
          >
            <Send className="h-3.5 w-3.5" /> Log
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-slate-400">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
