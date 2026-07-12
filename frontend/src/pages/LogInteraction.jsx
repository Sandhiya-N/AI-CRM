import InteractionForm from '../components/InteractionForm';
import AIAssistantPanel from '../components/AIAssistantPanel';

export default function LogInteraction() {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[720px] grid-cols-[minmax(0,7fr)_minmax(20rem,3fr)] items-start gap-4">
          <InteractionForm />
          <aside className="sticky top-6 h-[calc(100vh-8.5rem)] min-h-[520px]">
            <AIAssistantPanel />
          </aside>
        </div>
    </div>
  );
}
