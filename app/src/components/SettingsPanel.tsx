// F4: 设置中心（5 套主题切换 + JSON 导入/导出）
import { useRef, useState } from 'react';
import type { ThemeId } from '../hooks/useTheme';
import { THEMES } from '../hooks/useTheme';
import { exportBackup, downloadBackupFile, importBackup, clearAllData } from '../lib/backup';

interface SettingsPanelProps {
  theme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  totalCount: number;
  onChanged: () => void;
}

export function SettingsPanel({ theme, onThemeChange, totalCount, onChanged }: SettingsPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleExport = async () => {
    setMessage(''); setError(''); setBusy(true);
    try {
      const pkg = await exportBackup();
      downloadBackupFile(pkg);
      setMessage(`已导出 ${pkg.mistakes.length} 条错题`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '导出失败');
    } finally {
      setBusy(false);
    }
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMessage(''); setError(''); setBusy(true);
    try {
      const result = await importBackup(file);
      setMessage(`已导入 ${result.imported} 条，跳过 ${result.skipped} 条（重复或格式错误）`);
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : '导入失败');
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('确定清空所有错题？此操作不可撤销，请先导出备份。')) return;
    setMessage(''); setError(''); setBusy(true);
    try {
      await clearAllData();
      setMessage('已清空所有错题');
      onChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : '清空失败');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-3">主题配色</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {(Object.keys(THEMES) as ThemeId[]).map((id) => {
            const meta = THEMES[id];
            const selected = id === theme;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onThemeChange(id)}
                className={`p-3 rounded border-2 text-left transition ${
                  selected ? 'border-[var(--primary)]' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-4 h-4 rounded" style={{ background: meta.primary }} />
                  <span className="text-sm font-medium">{meta.label}</span>
                </div>
                <div className="text-xs text-slate-500">点击切换</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">数据备份与恢复</h2>
        <div className="text-sm text-slate-600 mb-3">
          当前共 <strong>{totalCount}</strong> 条错题 · IndexedDB 本地存储
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={busy}
            className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
          >
            导出备份
          </button>
          <button
            type="button"
            onClick={handleImportClick}
            disabled={busy}
            className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50"
          >
            导入备份
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImportFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClearAll}
            disabled={busy}
            className="px-3 py-1.5 text-sm bg-rose-50 text-rose-600 rounded hover:bg-rose-100 disabled:opacity-50"
          >
            清空所有错题
          </button>
        </div>
        {message && <div className="mt-2 text-sm text-green-600">{message}</div>}
        {error && <div className="mt-2 text-sm text-rose-600">{error}</div>}
      </section>

      <section className="text-xs text-slate-400">
        版本：v2.1.0 (Standalone) · 数据完全本地 · 断网可用
      </section>
    </div>
  );
}
