import { useI18n } from '../hooks/useI18n';

const languages = [
  { code: 'en' as const, label: '🇺🇸 EN', name: 'English' },
  { code: 'de' as const, label: '🇩🇪 DE', name: 'Deutsch' },
  { code: 'fa' as const, label: '🇮🇷 فا', name: 'فارسی' },
];

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as any)}
      className="glass glass-hover rounded-lg px-3 py-2 shadow-lg text-white text-sm border-none outline-none bg-transparent"
    >
      {languages.map(({ code, label, name }) => (
        <option key={code} value={code} className="bg-gray-800 text-white">
          {label}
        </option>
      ))}
    </select>
  );
}
