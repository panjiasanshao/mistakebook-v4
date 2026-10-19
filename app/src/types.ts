// 错题本数据类型（按 v1.md 第三章 SingleFileMistakeItem）
// 核心字段满足当前单机版，预留字段供未来平滑演进（当前版本不使用）

export type Subject =
  | '数学' | '语文' | '英语' | '物理' | '化学'
  | '生物' | '历史' | '地理' | '道法/政治' | '其他';

export type MistakeStatus = 'PENDING' | 'PROGRESS' | 'MASTERED';

export type MistakeReason =
  | '概念不清' | '审题粗心' | '计算失误'
  | '思路堵塞' | '新颖题型' | '公式混淆';

export interface MistakeItem {
  // 核心字段（当前单机版使用）
  id: string;
  subject: Subject;
  source: string;
  difficulty: number;          // 1-5 星
  reasons: MistakeReason[];
  questionText: string;
  reflection: string;
  analysis: string;
  status: MistakeStatus;
  createdAt: number;           // 毫秒时间戳
  reviewCount: number;
  imageData?: string;          // Base64 DataURL（Canvas 压缩后）

  // 预留字段（未来演进使用，当前版本可选/空）
  familyId?: string;
  creatorRole?: 'PARENT' | 'CHILD';
  knowledgePoints?: string[];
  practiceHistory?: Array<{
    timestamp: number;
    result: 'CORRECT' | 'WRONG';
    timeSpentSeconds?: number;
  }>;
  aiContext?: {
    isVariant: boolean;
    parentQuestionId?: string;
    tutoringChatHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
  };
}

// 导出/导入备份包结构
export interface BackupPackage {
  version: string;
  exportedAt: number;
  mistakes: MistakeItem[];
}

export const SUBJECTS: Subject[] = [
  '数学', '语文', '英语', '物理', '化学',
  '生物', '历史', '地理', '道法/政治', '其他',
];

export const REASONS: MistakeReason[] = [
  '概念不清', '审题粗心', '计算失误',
  '思路堵塞', '新颖题型', '公式混淆',
];

export const STATUS_META: Record<MistakeStatus, { label: string; emoji: string; color: string }> = {
  PENDING:  { label: '待攻克', emoji: '⚠️', color: 'amber' },
  PROGRESS: { label: '攻克中', emoji: '🚀', color: 'blue' },
  MASTERED: { label: '已掌握', emoji: '👏', color: 'green' },
};
