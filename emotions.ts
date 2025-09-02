export const EMOTIONS = {
  HAPPY: {
    name: 'HAPPY',
    emoji: '😊',
    color: 'emotion-happy',
    description: 'Feeling joyful and positive',
  },
  SAD: {
    name: 'SAD',
    emoji: '😢',
    color: 'emotion-sad',
    description: 'Feeling down or melancholy',
  },
  ANGRY: {
    name: 'ANGRY',
    emoji: '😠',
    color: 'emotion-angry',
    description: 'Feeling frustrated or mad',
  },
  ANXIOUS: {
    name: 'ANXIOUS',
    emoji: '😰',
    color: 'emotion-anxious',
    description: 'Feeling worried or nervous',
  },
  EXCITED: {
    name: 'EXCITED',
    emoji: '🤩',
    color: 'emotion-excited',
    description: 'Feeling energetic and enthusiastic',
  },
  CALM: {
    name: 'CALM',
    emoji: '😌',
    color: 'emotion-calm',
    description: 'Feeling peaceful and relaxed',
  },
} as const;

export type EmotionType = keyof typeof EMOTIONS;

export function getEmotionInfo(emotion: string) {
  return EMOTIONS[emotion as EmotionType] || EMOTIONS.CALM;
}

export const quickEmotionTexts = {
  happy: "I'm feeling really happy and positive today!",
  sad: "I'm feeling down and a bit sad right now.",
  anxious: "I'm feeling anxious and worried about things.",
  excited: "I'm so excited and full of energy!",
  angry: "I'm feeling frustrated and angry about something.",
  calm: "I'm feeling peaceful and calm right now.",
};
