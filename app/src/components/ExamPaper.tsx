// Module 4 + F3: 组卷篮 + A4 双栏打印
import type { MistakeItem } from '../types';
import { STATUS_META } from '../types';

interface ExamPaperProps {
  mistakes: MistakeItem[];
  onClearBasket: () => void;
}

export function ExamPaper({ mistakes, onClearBasket }: ExamPaperProps) {
  if (mistakes.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        组卷篮为空。请在错题库中勾选"组卷"，或批量加入筛选结果。
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* 屏幕视图：操作按钮 */}
      <div className="no-print flex items-center justify-between bg-slate-50 px-4 py-2 rounded">
        <span className="text-sm text-slate-600">组卷篮共 {mistakes.length} 道题</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 text-sm bg-[var(--primary)] text-white rounded hover:bg-[var(--primary-dark)]"
          >
            打印试卷
          </button>
          <button
            type="button"
            onClick={onClearBasket}
            className="px-3 py-1.5 text-sm bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
          >
            清空组卷篮
          </button>
        </div>
      </div>

      {/* 打印区域：A4 双栏试卷 */}
      <div id="printArea" className="print-area">
        {/* 试卷抬头 */}
        <header className="paper-header">
          <h1 className="text-2xl font-bold text-center">错题重练试卷</h1>
          <div className="paper-meta">
            <span>姓名：____________</span>
            <span>学号：____________</span>
            <span>日期：____________</span>
            <span>得分：____________</span>
          </div>
          <hr className="my-2 border-slate-400" />
        </header>

        {/* 双栏题目区 */}
        <div className="paper-questions">
          {mistakes.map((m, idx) => (
            <article key={m.id} className="paper-question">
              <div className="paper-question-head">
                <span className="font-bold">{idx + 1}. [{m.subject}]</span>
                <span className="text-xs text-slate-500">
                  {'★'.repeat(m.difficulty)}
                </span>
                <span className="text-xs text-slate-500">{m.source}</span>
              </div>
              {m.imageData && (
                <img src={m.imageData} alt={`第 ${idx + 1} 题图`} className="paper-img" />
              )}
              {m.questionText && (
                <div className="paper-text">{m.questionText}</div>
              )}
              <div className="paper-answer-area" aria-hidden="true">
                解答：
              </div>
            </article>
          ))}
        </div>

        {/* 文末独立附录页：参考答案与错因警示 */}
        <section className="paper-appendix">
          <h2 className="paper-appendix-title">参考答案与错因警示</h2>
          {mistakes.map((m, idx) => (
            <article key={`ans-${m.id}`} className="paper-answer">
              <div className="font-bold">第 {idx + 1} 题 答案：</div>
              <div className="paper-text">{m.analysis || '（暂无解析）'}</div>
              {m.reasons.length > 0 && (
                <div className="text-xs text-rose-700 mt-1">
                  ⚠️ 错因警示：{m.reasons.join('、')}
                </div>
              )}
              {m.reflection && (
                <div className="text-xs text-slate-600 italic mt-1">
                  反思：{m.reflection}
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
