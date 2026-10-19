// Module 5: 备份管理（JSON 导出/导入）
import type { BackupPackage, MistakeItem } from '../types';
import { dbGetAllMistakes, dbSaveMistake, dbClearAll } from './db';

const BACKUP_VERSION = '2.1.0';

export async function exportBackup(): Promise<BackupPackage> {
  const mistakes = await dbGetAllMistakes();
  return {
    version: BACKUP_VERSION,
    exportedAt: Date.now(),
    mistakes,
  };
}

export function downloadBackupFile(pkg: BackupPackage): void {
  const json = JSON.stringify(pkg, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const date = new Date().toISOString().slice(0, 10);
  a.download = `错题本备份-${date}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importBackup(file: File): Promise<{ imported: number; skipped: number }> {
  const text = await file.text();
  let pkg: BackupPackage;
  try {
    pkg = JSON.parse(text) as BackupPackage;
  } catch {
    throw new Error('备份文件格式错误，无法解析 JSON');
  }
  if (!pkg.version || !Array.isArray(pkg.mistakes)) {
    throw new Error('备份文件结构不正确，缺少 version/mistakes 字段');
  }
  let imported = 0;
  let skipped = 0;
  const existing = await dbGetAllMistakes();
  const existingIds = new Set(existing.map((m) => m.id));
  for (const item of pkg.mistakes) {
    if (!isValidMistake(item)) {
      skipped++;
      continue;
    }
    if (existingIds.has(item.id)) {
      skipped++;
      continue;
    }
    await dbSaveMistake(item);
    imported++;
  }
  return { imported, skipped };
}

function isValidMistake(item: unknown): item is MistakeItem {
  if (typeof item !== 'object' || item === null) return false;
  const m = item as Record<string, unknown>;
  return (
    typeof m.id === 'string' &&
    typeof m.subject === 'string' &&
    typeof m.createdAt === 'number' &&
    Array.isArray(m.reasons) &&
    (m.status === 'PENDING' || m.status === 'PROGRESS' || m.status === 'MASTERED')
  );
}

export async function clearAllData(): Promise<void> {
  await dbClearAll();
}
