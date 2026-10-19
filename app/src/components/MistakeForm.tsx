// F1: 录入模块（Ctrl+V 粘贴 + Canvas 压缩 + 元数据表单）
import { useEffect, useRef, useState } from 'react';
import type { MistakeItem, MistakeReason, Subject } from '../types';
import { SUBJECTS, REASONS } from '../types';
import { compressImage, extractImageFromClipboard } from '../lib/imagePipeline';

interface MistakeFormProps {
  onSave: (item: MistakeItem) => Promise<void>;
  onDone: () => void;
}

export function MistakeForm({ onSave, onDone }: MistakeFormProps) {
  const [subject, setSubject] = useState<Subject>('数学');
  const [source, setSource] = useState('');
  const [difficulty, setDifficulty] = useState(3);
  const [reasons, setReasons] = useState<MistakeReason[]>([]);
  const [questionText, setQuestionText] = useState('');
  const [reflection, setReflection] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [imageData, setImageData] = useState<string>('');
  const [pasteHint, setPasteHint] = useState('在此区域 Ctrl+V 粘贴截图，或点击选择文件');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 全局粘贴监听
  useEffect(() => {
    const onPaste = async (e: ClipboardEvent) => {
      const blob = extractImageFromClipboard(e);
      if (!blob) return;
      try {
        const dataUrl = await compressImage(blob);
        setImageData(dataUrl);
        setPasteHint('已粘贴图片，可重新粘贴替换');
      } catch (err) {
        setError(err instanceof Error ? err.message : '图片处理失败');
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await compressImage(file);
      setImageData(dataUrl);
      setPasteHint('已选择图片');
    } catch (err) {
      setError(err instanceof Error ? err.message : '图片处理失败');
    }
  };

  const toggleReason = (r: MistakeReason) => {
    setReasons((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!questionText.trim() && !imageData) {
      setError('请至少填写题干或粘贴一张图片');
      return;
    }
    setSubmitting(true);
    try {
      const item: MistakeItem = {
        id: `mistake_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        subject,
        source: source.trim(),
        difficulty,
        reasons,
        questionText: questionText.trim(),
        reflection: reflection.trim(),
        analysis: analysis.trim(),
        status: 'PENDING',
        createdAt: Date.now(),
        reviewCount: 0,
        imageData: imageData || undefined,
      };
      await onSave(item);
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
      <div
        className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-[var(--primary)]"
        onClick={() => fileInputRef.current?.click()}
      >
        {imageData ? (
          <img src={imageData} alt="题目" className="max-h-48 mx-auto rounded" />
        ) : (
          <div className="text-slate-500 text-sm">{pasteHint}</div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="hidden"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="block text-slate-600 mb-1">学科</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value as Subject)}
            className="w-full border border-slate-200 rounded px-2 py-1.5"
          >
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </label>
        <label className="text-sm">
          <span className="block text-slate-600 mb-1">题目来源</span>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="如：期中卷第 18 题"
            className="w-full border border-slate-200 rounded px-2 py-1.5"
          />
        </label>
      </div>

      <div className="text-sm">
        <span className="block text-slate-600 mb-1">难度星级</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setDifficulty(n)}
              className={`text-xl ${n <= difficulty ? 'text-amber-500' : 'text-slate-300'}`}
              aria-label={`${n} 星`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="text-sm">
        <span className="block text-slate-600 mb-1">错因分类（多选）</span>
        <div className="flex flex-wrap gap-1">
          {REASONS.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => toggleReason(r)}
              className={`text-xs px-2 py-1 rounded ${
                reasons.includes(r)
                  ? 'bg-[var(--primary)] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <label className="text-sm block">
        <span className="block text-slate-600 mb-1">题干（支持纯文本）</span>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded px-2 py-1.5"
          placeholder="可填写题干文字；如有截图可只粘贴图片"
        />
      </label>

      <label className="text-sm block">
        <span className="block text-slate-600 mb-1">孩子反思点</span>
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={2}
          className="w-full border border-slate-200 rounded px-2 py-1.5"
          placeholder="当时为什么错、漏看了什么"
        />
      </label>

      <label className="text-sm block">
        <span className="block text-slate-600 mb-1">正确答案与解析（隐藏在卡片背面）</span>
        <textarea
          value={analysis}
          onChange={(e) => setAnalysis(e.target.value)}
          rows={3}
          className="w-full border border-slate-200 rounded px-2 py-1.5"
        />
      </label>

      {error && <div className="text-rose-600 text-sm">{error}</div>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)] disabled:opacity-50"
        >
          {submitting ? '保存中…' : '保存错题'}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="px-4 py-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
        >
          取消
        </button>
      </div>
    </form>
  );
}
