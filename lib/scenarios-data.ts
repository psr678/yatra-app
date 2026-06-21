import type { Vibe, Region } from './circuits-data';

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  description: string;
  vibes: Vibe[];
  suggestedRegions: Region[];
  circuitIds: string[];      // ordered by best fit
  destinationExamples: string[];
  bestFor: string;           // one-liner e.g. "Couples & honeymooners"
  avoidIf: string;           // one-liner e.g. "You dislike crowds"
}

const SCENARIOS: Scenario[] = [
  {
    id: 'heritage',
    label: 'Heritage & History',
    icon: '🏰',
    description: 'Forts, palaces, ancient temples and UNESCO sites',
    vibes: ['heritage', 'cultural'],
    suggestedRegions: ['north', 'west', 'south', 'central'],
    circuitIds: ['golden-triangle', 'rajasthan-heritage', 'khajuraho-varanasi', 'tamil-heritage', 'karnataka-heritage'],
    destinationExamples: ['Agra', 'Jaipur', 'Hampi', 'Varanasi', 'Khajuraho'],
    bestFor: 'History lovers & culture seekers',
    avoidIf: 'You prefer beaches or outdoor adventure',
  },
  {
    id: 'beach',
    label: 'Beach & Coastal',
    icon: '🏖️',
    description: 'Sun, sand, seafood and coastal vibes',
    vibes: ['beach', 'romantic'],
    suggestedRegions: ['west', 'south', 'east'],
    circuitIds: ['goa-konkan', 'kerala-backwaters', 'andaman-islands', 'kerala-complete'],
    destinationExamples: ['Goa', 'Kovalam', 'Varkala', 'Andaman', 'Pondicherry'],
    bestFor: 'Couples, beach lovers & relaxation seekers',
    avoidIf: 'You dislike humidity or crowds in season',
  },
  {
    id: 'mountains',
    label: 'Mountains & Hills',
    icon: '🏔️',
    description: 'Snow peaks, hill stations and cool escapes',
    vibes: ['hill', 'adventure', 'nature'],
    suggestedRegions: ['north', 'northeast'],
    circuitIds: ['shimla-manali', 'himalayan-loop', 'ladakh-leh', 'sikkim-darjeeling'],
    destinationExamples: ['Manali', 'Shimla', 'Darjeeling', 'Leh', 'Ooty'],
    bestFor: 'Adventure seekers & those escaping the heat',
    avoidIf: 'You have altitude sensitivity or limited fitness',
  },
  {
    id: 'wildlife',
    label: 'Wildlife & Jungles',
    icon: '🐯',
    description: 'Tiger safaris, rhinos, elephants and forest lodges',
    vibes: ['wildlife', 'nature', 'adventure'],
    suggestedRegions: ['central', 'northeast', 'south', 'north'],
    circuitIds: ['madhya-pradesh-wildlife', 'northeast-explorer', 'uttarakhand-nature', 'kerala-complete'],
    destinationExamples: ['Bandhavgarh', 'Kaziranga', 'Jim Corbett', 'Thekkady', 'Ranthambore'],
    bestFor: 'Nature lovers, photographers & families',
    avoidIf: 'You want nightlife or city comforts',
  },
  {
    id: 'spiritual',
    label: 'Spiritual & Wellness',
    icon: '🙏',
    description: 'Temples, ashrams, yoga retreats and sacred rivers',
    vibes: ['spiritual', 'cultural'],
    suggestedRegions: ['north', 'south', 'east', 'central'],
    circuitIds: ['char-dham', 'khajuraho-varanasi', 'odisha-temples', 'tamil-heritage'],
    destinationExamples: ['Varanasi', 'Rishikesh', 'Haridwar', 'Tirupati', 'Puri'],
    bestFor: 'Pilgrims, yoga enthusiasts & seekers of peace',
    avoidIf: 'You prefer nightlife or non-religious travel',
  },
  {
    id: 'adventure',
    label: 'Adventure & Trekking',
    icon: '🧗',
    description: 'Treks, river rafting, camping and adrenaline activities',
    vibes: ['adventure', 'hill', 'nature'],
    suggestedRegions: ['north', 'northeast'],
    circuitIds: ['ladakh-leh', 'himalayan-loop', 'shimla-manali', 'uttarakhand-nature'],
    destinationExamples: ['Leh', 'Spiti', 'Rishikesh', 'Manali', 'Kasol'],
    bestFor: 'Solo travellers, groups & thrill seekers',
    avoidIf: 'You prefer luxury or comfort travel',
  },
  {
    id: 'romantic',
    label: 'Romantic Getaway',
    icon: '💑',
    description: 'Honeymoon spots, scenic stays and intimate escapes',
    vibes: ['romantic', 'beach', 'hill', 'nature'],
    suggestedRegions: ['south', 'west', 'north', 'northeast'],
    circuitIds: ['kerala-backwaters', 'andaman-islands', 'shimla-manali', 'sikkim-darjeeling', 'goa-konkan'],
    destinationExamples: ['Alleppey', 'Andaman', 'Udaipur', 'Munnar', 'Coorg'],
    bestFor: 'Couples & honeymooners',
    avoidIf: 'You are travelling solo or in a large group',
  },
  {
    id: 'cultural',
    label: 'Art, Food & Culture',
    icon: '🎨',
    description: 'Street food, music, art and local festivals',
    vibes: ['cultural', 'heritage'],
    suggestedRegions: ['west', 'south', 'north'],
    circuitIds: ['rajasthan-heritage', 'tamil-heritage', 'golden-triangle', 'maharashtra-mix'],
    destinationExamples: ['Jaipur', 'Chennai', 'Kolkata', 'Ahmedabad', 'Pondicherry'],
    bestFor: 'Foodies, artists & experience collectors',
    avoidIf: 'You want purely outdoor or adventure travel',
  },
  {
    id: 'offbeat',
    label: 'Offbeat & Hidden Gems',
    icon: '🗺️',
    description: 'Uncrowded places, tribal culture and roads less travelled',
    vibes: ['cultural', 'nature', 'adventure'],
    suggestedRegions: ['northeast', 'east', 'central'],
    circuitIds: ['northeast-explorer', 'odisha-temples', 'gujarat-heritage', 'uttarakhand-nature'],
    destinationExamples: ['Majuli', 'Ziro', 'Mandu', 'Lepakshi', 'Dholavira'],
    bestFor: 'Repeat India travellers & explorers',
    avoidIf: 'You need tourist infrastructure or are a first-timer',
  },
  {
    id: 'family',
    label: 'Family Friendly',
    icon: '👨‍👩‍👧',
    description: 'Kid-friendly attractions, manageable distances and comfort',
    vibes: ['heritage', 'wildlife', 'beach', 'nature'],
    suggestedRegions: ['north', 'south', 'west'],
    circuitIds: ['golden-triangle', 'kerala-complete', 'goa-konkan', 'rajasthan-quick'],
    destinationExamples: ['Delhi', 'Jaipur', 'Goa', 'Kochi', 'Mysuru'],
    bestFor: 'Families with children of all ages',
    avoidIf: 'You want very remote or strenuous routes',
  },
];

export default SCENARIOS;

export function getScenarioById(id: string): Scenario | undefined {
  return SCENARIOS.find(s => s.id === id);
}
