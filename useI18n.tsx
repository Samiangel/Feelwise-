import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'de' | 'fa';

interface Translation {
  [key: string]: string;
}

interface Translations {
  [lang: string]: Translation;
}

const translations: Translations = {
  en: {
    'app.title': 'FeelWise',
    'app.subtitle': 'AI-Powered Emotion Analysis',
    'home.analyze_text': 'Analyze Text',
    'home.analyze_text_desc': 'Type your feelings',
    'home.analyze_voice': 'Analyze Voice',
    'home.analyze_voice_desc': 'Speak your emotions',
    'home.analyses': 'Analyses',
    'home.days_streak': 'Days Streak',
    'home.history': 'History',
    'text_input.title': 'How are you feeling?',
    'text_input.prompt': 'Tell me what\'s on your mind...',
    'text_input.placeholder': 'Type your feelings here...',
    'text_input.analyze': 'Analyze Emotion',
    'text_input.quick_select': 'Quick select:',
    'voice_input.title': 'Voice Analysis',
    'voice_input.prompt': 'I\'m listening to your voice...',
    'voice_input.recording': 'Recording...',
    'voice_input.transcription': 'Transcription:',
    'voice_input.analyze': 'Analyze Emotion',
    'voice_input.tips_title': 'Tips for better analysis:',
    'voice_input.tip1': '• Speak clearly and naturally',
    'voice_input.tip2': '• Describe your feelings in detail',
    'voice_input.tip3': '• Find a quiet environment',
    'result.title': 'Analysis Results',
    'result.detected_emotion': 'Detected Emotion:',
    'result.confidence': 'Confidence',
    'result.intensity': 'Intensity',
    'result.recommended_music': 'Recommended Music',
    'result.breathing_exercise': 'Breathing Exercise',
    'result.breathing_desc': '4-7-8 Technique',
    'result.breathing_time': '5 minutes guided session',
    'result.analyze_again': 'Analyze Again',
    'result.save': 'Save Result',
    'history.title': 'Emotion History',
    'history.this_week': 'This Week',
    'history.recent': 'Recent Analyses',
    'history.all': 'All',
    'history.empty': 'No emotion analyses yet',
    'history.empty_desc': 'Start by analyzing your emotions!',
    'emotions.happy': 'Happy',
    'emotions.sad': 'Sad',
    'emotions.angry': 'Angry',
    'emotions.anxious': 'Anxious',
    'emotions.excited': 'Excited',
    'emotions.calm': 'Calm',
    'loading.analyzing': 'Analyzing your emotions...',
    'loading.subtitle': 'Timori is thinking',
    'error.analysis_failed': 'Failed to analyze emotion',
    'error.try_again': 'Please try again',
    'spotifyRecommendations': 'Music for Your Mood',
    'musicForYourMood': 'Personalized tracks from Spotify',
    'openInSpotify': 'Open in Spotify',
    'poweredBySpotify': 'Powered by Spotify',
  },
  de: {
    'app.title': 'FeelWise',
    'app.subtitle': 'KI-gestützte Emotionsanalyse',
    'home.analyze_text': 'Text Analysieren',
    'home.analyze_text_desc': 'Schreib deine Gefühle',
    'home.analyze_voice': 'Stimme Analysieren',
    'home.analyze_voice_desc': 'Sprich deine Emotionen',
    'home.analyses': 'Analysen',
    'home.days_streak': 'Tage Streak',
    'home.history': 'Verlauf',
    'text_input.title': 'Wie fühlst du dich?',
    'text_input.prompt': 'Was beschäftigt dich...',
    'text_input.placeholder': 'Schreibe deine Gefühle hier...',
    'text_input.analyze': 'Emotion Analysieren',
    'emotions.happy': 'Glücklich',
    'emotions.sad': 'Traurig',
    'emotions.angry': 'Wütend',
    'emotions.anxious': 'Ängstlich',
    'emotions.excited': 'Aufgeregt',
    'emotions.calm': 'Ruhig',
    'result.title': 'Analyseergebnisse',
    'result.detected_emotion': 'Erkannte Emotion:',
    'result.confidence': 'Vertrauen',
    'result.intensity': 'Intensität',
    'history.title': 'Emotionsverlauf',
    'history.empty': 'Noch keine Emotionsanalysen',
    'loading.analyzing': 'Analysiere deine Emotionen...',
    'error.analysis_failed': 'Analyse fehlgeschlagen',
    'spotifyRecommendations': 'Musik für deine Stimmung',
    'musicForYourMood': 'Persönliche Tracks von Spotify',
    'openInSpotify': 'In Spotify öffnen',
    'poweredBySpotify': 'Unterstützt von Spotify',
  },
  fa: {
    'app.title': 'فیل‌وایز',
    'app.subtitle': 'تحلیل احساسات با هوش مصنوعی',
    'home.analyze_text': 'تحلیل متن',
    'home.analyze_text_desc': 'احساساتت رو بنویس',
    'home.analyze_voice': 'تحلیل صدا',
    'home.analyze_voice_desc': 'احساساتت رو بگو',
    'home.analyses': 'تحلیل‌ها',
    'home.history': 'تاریخچه',
    'text_input.title': 'چطور احساس می‌کنی؟',
    'text_input.prompt': 'بگو چی تو ذهنته...',
    'text_input.placeholder': 'احساساتت رو اینجا بنویس...',
    'text_input.analyze': 'تحلیل احساسات',
    'emotions.happy': 'خوشحال',
    'emotions.sad': 'غمگین',
    'emotions.angry': 'عصبانی',
    'emotions.anxious': 'مضطرب',
    'emotions.excited': 'هیجان‌زده',
    'emotions.calm': 'آرام',
    'result.title': 'نتایج تحلیل',
    'result.detected_emotion': 'احساس تشخیص داده شده:',
    'result.confidence': 'اطمینان',
    'result.intensity': 'شدت',
    'history.title': 'تاریخچه احساسات',
    'history.empty': 'هنوز تحلیل احساساتی نداری',
    'loading.analyzing': 'در حال تحلیل احساساتت...',
    'error.analysis_failed': 'تحلیل ناموفق بود',
    'spotifyRecommendations': 'موسیقی برای حالت',
    'musicForYourMood': 'آهنگ‌های شخصی از اسپاتیفای',
    'openInSpotify': 'باز کردن در اسپاتیفای',
    'poweredBySpotify': 'قدرت گرفته از اسپاتیفای',
  },
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('feelwise-language') as Language;
    if (savedLang && ['en', 'de', 'fa'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('feelwise-language', language);
    
    // Update body classes for font and direction
    const body = document.body;
    body.classList.remove('persian', 'german');
    
    if (language === 'fa') {
      body.classList.add('persian');
      body.style.direction = 'rtl';
    } else {
      body.style.direction = 'ltr';
      if (language === 'de') {
        body.classList.add('german');
      }
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
