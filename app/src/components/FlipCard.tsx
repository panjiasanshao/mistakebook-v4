// Module 3: 3D 翻转卡片 + 掌握状态机
import { useState, type KeyboardEvent } from 'react';
import type { MistakeItem, MistakeStatus } from '../types';
import { STATUS_META } from '../types';

interface FlipCardProps {
  item: MistakeItem;
  inBasket: boolean;
  onToggleBasket: (id: string) => void;
  onUpdateStatus: (id: string, status: MistakeStatus) => void;
  onDelete: (id: string) => void;
}

export function FlipCard({ item, inBasket, onToggleBasket, onUpdateStatus, onDelete }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const meta = STATUS_META[item.status];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((v) => !v);
    }
  };

  return (
    <div
      className="flip-card"
      tabIndex={0}
      aria-pressed={flipped}
      onKeyDown={handleKeyDown}
    >
      <div className={'flip-card-inner' + (flipped ? ' flipped' : '')}>
        {/* 正面：题目视图（严禁暴露答案） */}
        <div className="flip-card-front bg-white border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {item.subject}
                </span>
                <span className="text-xs text-amber-500" title={`难度 ${item.difficulty} 星`}>
                  {'★'.repeat(item.difficulty)}{'☆'.repeat(5 - item.difficulty)}
                </span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded ${statusBadgeClass(item.status)}`}>
                {meta.emoji} {meta.label}
              </span>
            </div>
            {item.source && (
              <div className="text-xs text-slate-500 mb-2">来源：{item.source}</div>
            )}
            {item.reasons.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.reasons.map((r) => (
                  <span key={r} className="text-xs px-1.5 py-0.5 bg-rose-50 text-rose-600 rounded">{r}</span>
                ))}
              </div>
            )}
            {item.imageData && (
              <img src={item.imageData} alt="题干" className="w-full mb-2 rounded border border-slate-100" />
            )}
            {item.questionText && (
              <div className="text-sm text-slate-700 whitespace-pre-wrap">{item.questionText}</div>
            )}
            {item.reflection && (
              <div className="mt-2 text-xs text-slate-500 italic">
                反思：{item.reflection}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            <label className="text-xs flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                checked={inBasket}
                onChange={() => onToggleBasket(item.id)}
                className="accent-[var(--primary)]"
              />
              组卷
            </label>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="text-xs px-3 py-1 rounded bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)]"
            >
              翻转看答案
            </button>
          </div>
        </div>

        {/* 背面：解析视图 */}
        <div className="flip-card-back bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-300 mb-2">标准答案与解析</div>
            <div className="text-sm whitespace-pre-wrap">{item.analysis || '（暂无解析）'}</div>
            <div className="mt-3 text-xs text-slate-400">
              已复习 {item.reviewCount} 次 · 录入于 {new Date(item.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-slate-700">
            <button
              type="button"
              onClick={() => setFlipped(false)}
              className="text-xs px-3 py-1 rounded bg-slate-700 hover:bg-slate-600"
            >
              翻回题目
            </button>
            <div className="flex gap-1">
              {(['PENDING', 'PROGRESS', 'MASTERED'] as MistakeStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdateStatus(item.id, s)}
                  className={`flex-1 text-xs px-2 py-1 rounded ${
                    item.status === s
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                  }`}
                >
                  {STATUS_META[s].emoji} {STATUS_META[s].label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-xs text-rose-300 hover:text-rose-200"
            >
              删除此题
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function statusBadgeClass(status: MistakeStatus): string {
  switch (status) {
    case 'PENDING':  return 'bg-amber-100 text-amber-700';
    case 'PROGRESS': return 'bg-blue-100 text-blue-700';
    case 'MASTERED': return 'bg-green-100 text-green-700';
  }
}
