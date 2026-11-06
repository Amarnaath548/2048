import { ThemeDefinition } from '../core/types.ts';

export const CLASSIC_FOOD_THEME: ThemeDefinition = {
  id: 'classic-food',
  name: 'South Indian Food',
  tamilName: 'தென்னிந்திய உணவு',
  description: 'From a single rice grain to the legendary Golden Feast! 11 delicious tiers.',
  unlockCost: 0,
  totalTiers: 11,
  accentColor: '#e65100',
  boardBg: '#bbada0',
  cellEmptyBg: 'rgba(238, 228, 218, 0.35)',
  tiers: [
    {
      tier: 1,
      name: 'Rice Grain',
      tamilName: 'அரிசி மணி',
      value: 2,
      bgColor: '#fdf6e2',
      textColor: '#776e65',
      symbol: '🌾',
      funFact: 'Every great South Indian feast begins with a single grain of ponni rice!'
    },
    {
      tier: 2,
      name: 'Idli',
      tamilName: 'இட்லி',
      value: 4,
      bgColor: '#fffae6',
      textColor: '#776e65',
      symbol: '⚪',
      funFact: 'Steamed to fluffy perfection, paired with gun-powder podi and chutney!'
    },
    {
      tier: 3,
      name: 'Crispy Dosa',
      tamilName: 'தோசை',
      value: 8,
      bgColor: '#f2b179',
      textColor: '#ffffff',
      symbol: '🥞',
      funFact: 'Golden roast ghee roast dosa, crispy on the outside and soft inside.'
    },
    {
      tier: 4,
      name: 'Meduvada',
      tamilName: 'வடை',
      value: 16,
      bgColor: '#f59563',
      textColor: '#ffffff',
      symbol: '🥯',
      funFact: 'Crunchy golden exterior with cumin, curry leaves and pepper!'
    },
    {
      tier: 5,
      name: 'Ven Pongal',
      tamilName: 'பொங்கல்',
      value: 32,
      bgColor: '#f67c5f',
      textColor: '#ffffff',
      symbol: '🥣',
      funFact: 'Comfort in a bowl cooked with ghee, roasted cashews and black pepper.'
    },
    {
      tier: 6,
      name: 'Sambar Rice',
      tamilName: 'சாம்பார் சாதம்',
      value: 64,
      bgColor: '#f65e3b',
      textColor: '#ffffff',
      symbol: '🍲',
      funFact: 'Tangy tamarind, shallots and aromatic sambar podi bubbling hot!'
    },
    {
      tier: 7,
      name: 'Dindigul Biryani',
      tamilName: 'பிரியாணி',
      value: 128,
      bgColor: '#edcf72',
      textColor: '#ffffff',
      symbol: '🍛',
      funFact: 'Fragrant seeraga samba rice simmered with whole spices and tender masala!'
    },
    {
      tier: 8,
      name: 'Special Thali',
      tamilName: 'சாப்பாடு தட்டு',
      value: 256,
      bgColor: '#edcc61',
      textColor: '#ffffff',
      symbol: '🍱',
      funFact: 'A silver platter packed with kootu, poriyal, rasam, curd and appalam!'
    },
    {
      tier: 9,
      name: 'Banana-leaf Meal',
      tamilName: 'வாழை இலை விருந்து',
      value: 512,
      bgColor: '#4caf50',
      textColor: '#ffffff',
      symbol: '🍃',
      funFact: 'A grand traditional meal served piping hot on a fresh emerald plantain leaf!'
    },
    {
      tier: 10,
      name: 'Festival Feast',
      tamilName: 'திருவிழா விருந்து',
      value: 1024,
      bgColor: '#ff9800',
      textColor: '#ffffff',
      symbol: '👑',
      funFact: 'Weddings and Pongal celebrations — unlimited payasam and vadai!'
    },
    {
      tier: 11,
      name: 'Golden Feast',
      tamilName: 'தங்க விருந்து',
      value: 2048,
      bgColor: '#ffb300',
      textColor: '#ffffff',
      symbol: '✨',
      funFact: 'The pinnacle of culinary mastery! Reaching this tier wins the game!'
    }
  ]
};

export const TAMIL_LETTERS_THEME: ThemeDefinition = {
  id: 'tamil-letters',
  name: 'Tamil Letters (தமிழ் உயிர்)',
  tamilName: 'தமிழ் உயிர் எழுத்துக்கள்',
  description: 'Learn the 12 classical Tamil vowels from அ to ஔ through merging!',
  unlockCost: 100,
  totalTiers: 12,
  accentColor: '#9c27b0',
  boardBg: '#512da8',
  cellEmptyBg: 'rgba(255, 255, 255, 0.15)',
  tiers: [
    {
      tier: 1,
      name: 'அ (A)',
      tamilName: 'அ - அம்மா (Mother)',
      pronunciation: "'uh' as in America",
      value: 2,
      bgColor: '#e1bee7',
      textColor: '#4a148c',
      symbol: 'அ',
      funFact: 'அ (Agara mudhala...) - The very first letter of the Tamil alphabet!'
    },
    {
      tier: 2,
      name: 'ஆ (Aa)',
      tamilName: 'ஆ - ஆடு (Goat)',
      pronunciation: "'aah' as in Father",
      value: 4,
      bgColor: '#ce93d8',
      textColor: '#4a148c',
      symbol: 'ஆ',
      funFact: 'ஆ represents long vowel sound, foundational in classical poetry.'
    },
    {
      tier: 3,
      name: 'இ (I)',
      tamilName: 'இ - இலை (Leaf)',
      pronunciation: "'ih' as in Igloo",
      value: 8,
      bgColor: '#ba68c8',
      textColor: '#ffffff',
      symbol: 'இ',
      funFact: 'இ is the third vowel, often starting words like Ini (sweet).'
    },
    {
      tier: 4,
      name: 'ஈ (Ee)',
      tamilName: 'ஈ - ஈட்டி (Spear)',
      pronunciation: "'ee' as in Feet",
      value: 16,
      bgColor: '#ab47bc',
      textColor: '#ffffff',
      symbol: 'ஈ',
      funFact: 'ஈ is also a complete word in Tamil meaning "give" or "housefly"!'
    },
    {
      tier: 5,
      name: 'உ (U)',
      tamilName: 'உ - உரல் (Mortar)',
      pronunciation: "'oo' as in Book",
      value: 32,
      bgColor: '#9c27b0',
      textColor: '#ffffff',
      symbol: 'உ',
      funFact: 'உ starts words like Ulagam (world) and Udal (body).'
    },
    {
      tier: 6,
      name: 'ஊ (Oo)',
      tamilName: 'ஊ - ஊஞ்சல் (Swing)',
      pronunciation: "'ooo' as in Moon",
      value: 64,
      bgColor: '#8e24aa',
      textColor: '#ffffff',
      symbol: 'ஊ',
      funFact: 'ஊ represents joy and rhythm, like swinging in Oonjal.'
    },
    {
      tier: 7,
      name: 'எ (E)',
      tamilName: 'எ - எறும்பு (Ant)',
      pronunciation: "'eh' as in Elephant",
      value: 128,
      bgColor: '#7b1fa2',
      textColor: '#ffffff',
      symbol: 'எ',
      funFact: 'Short E sound, essential for asking questions in Tamil (Edhu, Engu).'
    },
    {
      tier: 8,
      name: 'ஏ (Ae)',
      tamilName: 'ஏ - ஏணி (Ladder)',
      pronunciation: "'ay' as in Say",
      value: 256,
      bgColor: '#6a1b9a',
      textColor: '#ffffff',
      symbol: 'ஏ',
      funFact: 'Long E vowel sound, climbs high like an Eani (ladder)!'
    },
    {
      tier: 9,
      name: 'ஐ (Ai)',
      tamilName: 'ஐ - ஐந்து (Five)',
      pronunciation: "'eye' as in Sky",
      value: 512,
      bgColor: '#4a148c',
      textColor: '#ffffff',
      symbol: 'ஐ',
      funFact: 'Diphthong combining ah + ih, means Lord, beauty, or the number five!'
    },
    {
      tier: 10,
      name: 'ஒ (O)',
      tamilName: 'ஒ - ஒட்டகம் (Camel)',
      pronunciation: "'oh' short as in Om",
      value: 1024,
      bgColor: '#311b92',
      textColor: '#ffffff',
      symbol: 'ஒ',
      funFact: 'Short O sound, starting words like Ondru (One) and Oli (Light).'
    },
    {
      tier: 11,
      name: 'ஓ (Oh)',
      tamilName: 'ஓ - ஓடம் (Boat)',
      pronunciation: "'ooh' as in Boat",
      value: 2048,
      bgColor: '#1a237e',
      textColor: '#ffffff',
      symbol: 'ஓ',
      funFact: 'Long O sound, flowing like an Odam (wooden boat) on calm backwaters.'
    },
    {
      tier: 12,
      name: 'ஔ (Au)',
      tamilName: 'ஔ - ஔவையார் (Avvaiyar)',
      pronunciation: "'ow' as in Owl",
      value: 4096,
      bgColor: '#ffd700',
      textColor: '#3e2723',
      symbol: 'ஔ',
      funFact: 'Named after the revered ancient Sangam poetess Avvaiyar!'
    }
  ]
};

export const ALL_THEMES: Record<string, ThemeDefinition> = {
  'classic-food': CLASSIC_FOOD_THEME,
  'tamil-letters': TAMIL_LETTERS_THEME
};

export function getTheme(id: string): ThemeDefinition {
  return ALL_THEMES[id] || CLASSIC_FOOD_THEME;
}
