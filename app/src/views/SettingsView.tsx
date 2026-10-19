import { SettingsPanel } from '../components/SettingsPanel';
import type { ThemeId } from '../hooks/useTheme';

interface SettingsViewProps {
  theme: ThemeId;
  onThemeChange: (t: ThemeId) => void;
  totalCount: number;
  onChanged: () => void;
}

export function SettingsView({ theme, onThemeChange, totalCount, onChanged }: SettingsViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">设置中心</h2>
      <SettingsPanel
        theme={theme}
        onThemeChange={onThemeChange}
        totalCount={totalCount}
        onChanged={onChanged}
      />
    </div>
  );
}
