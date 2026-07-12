import { Bot, User } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? 'bg-primary-600 text-white'
            : 'bg-slate-100 text-primary-600'
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-primary-600 text-white'
              : 'rounded-tl-sm border border-slate-100 bg-white text-slate-700 shadow-sm'
          }`}
        >
          {message.content}
        </div>
        <p className="mt-1 px-1 text-xs text-slate-400">
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}
