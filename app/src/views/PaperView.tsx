import { ExamPaper } from '../components/ExamPaper';
import type { MistakeItem } from '../types';

interface PaperViewProps {
  mistakes: MistakeItem[];
  onClearBasket: () => void;
}

export function PaperView({ mistakes, onClearBasket }: PaperViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold no-print">组卷重练</h2>
      <ExamPaper mistakes={mistakes} onClearBasket={onClearBasket} />
    </div>
  );
}
