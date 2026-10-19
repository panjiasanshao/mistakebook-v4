import { useState } from 'react';
import { useMistakes } from './hooks/useMistakes';
import { useTheme } from './hooks/useTheme';
import { useBasket } from './hooks/useBasket';
import { LibraryView } from './views/LibraryView';
import { CreateView } from './views/CreateView';
import { PaperView } from './views/PaperView';
import { SettingsView } from './views/SettingsView';

type Tab = 'library' | 'create' | 'paper' | 'settings';

export default function App() {
  const [tab, setTab] = useState<Tab>('library');
  const { mistakes, loading, save, remove, updateStatus, refresh } = useMistakes();
  const { theme, setTheme } = useTheme();
  const basket = useBasket();

  const basketMistakes = mistakes.filter((m) => basket.basketIds.has(m.id));

  const tabs: Array<{ id: Tab; label: string; badge?: number }> = [
    { id: 'library',  label: '错题库' },
    { id: 'create',   label: '录入错题' },
    { id: 'paper',    label: '重练组卷', badge: basket.count },
    { id: 'settings', label: '设置' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航（打印时隐藏） */}
      <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <h1 className="text-lg font-bold" style={{ color: 'var(--primary-dark)' }}>
            学海灯塔 · 错题本
          </h1>
          <nav className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-sm rounded ${
                  tab === t.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t.label}
                {t.badge ? (
                  <span className="ml-1 text-xs px-1.5 py-0.5 bg-rose-500 text-white rounded-full">
                    {t.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="no-print max-w-6xl mx-auto px-4 py-6">
        {tab === 'library' && (
          <LibraryView
            mistakes={mistakes}
            loading={loading}
            basketIds={basket.basketIds}
            onToggleBasket={basket.toggle}
            onAddManyToBasket={basket.addMany}
            onUpdateStatus={updateStatus}
            onDelete={remove}
            onCreateClick={() => setTab('create')}
          />
        )}
        {tab === 'create' && (
          <CreateView
            onSave={save}
            onDone={() => setTab('library')}
          />
        )}
        {tab === 'paper' && (
          <PaperView
            mistakes={basketMistakes}
            onClearBasket={basket.clear}
          />
        )}
        {tab === 'settings' && (
          <SettingsView
            theme={theme}
            onThemeChange={setTheme}
            totalCount={mistakes.length}
            onChanged={refresh}
          />
        )}
      </main>

      {/* 打印区域（仅 @media print 显示）：直接渲染组卷篮内容 */}
      {tab === 'paper' && (
        <div className="print-only">
          <PaperView mistakes={basketMistakes} onClearBasket={() => {}} />
        </div>
      )}
    </div>
  );
}
