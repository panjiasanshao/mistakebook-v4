import { MistakeForm } from '../components/MistakeForm';
import type { MistakeItem } from '../types';

interface CreateViewProps {
  onSave: (item: MistakeItem) => Promise<void>;
  onDone: () => void;
}

export function CreateView({ onSave, onDone }: CreateViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">录入错题</h2>
      <p className="text-sm text-slate-500">
        支持 Ctrl+V 直接粘贴剪贴板截图。图片会自动压缩（最大宽度 1000px，JPEG 0.75 质量）后存入本地 IndexedDB。
      </p>
      <MistakeForm onSave={onSave} onDone={onDone} />
    </div>
  );
}
