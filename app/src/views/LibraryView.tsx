// 错题库视图：统计卡片 + 筛选 + 3D 翻转卡片瀑布流
import { useMemo, useState } from 'react';
import type { MistakeItem, MistakeStatus, Subject } from '../types';
import { SUBJECTS, STATUS_META } from '../types';
import { FlipCard } from '../components/FlipCard';

interface LibraryViewProps {
  mistakes: MistakeItem[];
  loading: boolean;
  basketIds: Set<string>;
  onToggleBasket: (id: string) => void;
  onAddManyToBasket: (ids: string[]) => void;
  onUpdateStatus: (id: string, status: MistakeStatus) => void;
  onDelete: (id: string) => void;
  onCreateClick: () => void;
}

type StatusFilter = 'ALL' | MistakeStatus;
type SubjectFilter = 'ALL' | Subject;

export function LibraryView({
  mistakes, loading, basketIds, onToggleBasket, onAddManyToBasket,
  onUpdateStatus, onDelete, onCreateClick,
}: LibraryViewProps) {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('ALL');

  const stats = useMemo(() => ({
    total: mistakes.length,
    pending: mistakes.filter((m) => m.status === 'PENDING').length,
    progress: mistakes.filter((m) => m.status === 'PROGRESS').length,
    mastered: mistakes.filter((m) => m.status === 'MASTERED').length,
  }), [mistakes]);

  const filtered = useMemo(() => {
    return mistakes.filter((m) => {
      if (statusFilter !== 'ALL' && m.status !== statusFilter) return false;
      if (subjectFilter !== 'ALL' && m.subject !== subjectFilter) return false;
      return true;
    });
  }, [mistakes, statusFilter, subjectFilter]);

  if (loading) {
    return <div className="text-center py-12 text-slate-500">加载中…</div>;
  }

  if (mistakes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-slate-500 mb-4">还没有错题，开始录入第一道吧</div>
        <button
          type="button"
          onClick={onCreateClick}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
        >
          录入错题
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="总数" value={stats.total} tone="slate" />
        <StatCard label="待攻克" value={stats.pending} tone="amber" />
        <StatCard label="攻克中" value={stats.progress} tone="blue" />
        <StatCard label="已掌握" value={stats.mastered} tone="green" />
      </div>

      {/* 筛选条 */}
      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-slate-600">筛选：</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className="border border-slate-200 rounded px-2 py-1"
        >
          <option value="ALL">全部状态</option>
          {(['PENDING', 'PROGRESS', 'MASTERED'] as MistakeStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_META[s].emoji} {STATUS_META[s].label}</option>
          ))}
        </select>
        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value as SubjectFilter)}
          className="border border-slate-200 rounded px-2 py-1"
        >
          <option value="ALL">全部学科</option>
          {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <button
          type="button"
          onClick={() => onAddManyToBasket(filtered.map((m) => m.id))}
          className="ml-auto px-2 py-1 text-xs bg-[var(--primary-soft)] text-[var(--primary-dark)] rounded hover:bg-[var(--primary)] hover:text-white"
        >
          筛选结果加入组卷篮
        </button>
      </div>

      {/* 卡片瀑布流（CSS Grid 自适应） */}
      <div className="card-grid">
        {filtered.map((m) => (
          <FlipCard
            key={m.id}
            item={m}
            inBasket={basketIds.has(m.id)}
            onToggleBasket={onToggleBasket}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-8 text-slate-500">无符合条件的错题</div>
      )}
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone: string }) {
  const toneClass: Record<string, string> = {
    slate: 'bg-slate-50 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
    blue:  'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
  };
  return (
    <div className={`rounded p-3 text-center ${toneClass[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}
