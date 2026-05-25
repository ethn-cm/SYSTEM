export type QuestStatus = 'active' | 'completed' | 'failed' | 'abandoned';

export type QuestType = 'Main Quest' | 'Side Quest' | 'Bounty' | 'Errand';

export interface Task {
  label: string;
  done: boolean;
}

export interface Quest {
  id: number;
  title: string;
  type: QuestType;
  status: QuestStatus;
  location: string;
  objective: string;
  details: string;
  tasks: Task[];
  /** Optional image source for the quest (URI or require()). Placeholder used when absent. */
  image?: any;
}

export const quests: Quest[] = [
  // ── MAIN QUESTS — always exactly three ──
  {
    id: 3,
    title: 'Manners Maketh Man',
    type: 'Main Quest',
    status: 'active',
    image: require('../../assets/images/Banners/IMG_6897.jpg'),
    location: 'In Every Room',
    objective: 'Be unfailingly considerate',
    details:
      'Charm without cruelty. Hold the door. Send the note. Remember the name. The world is largely indifferent — your conduct is the part you control. Let it be impeccable.',
    tasks: [
      { label: 'Write three thank-you notes', done: false },
      { label: 'Listen more than you speak', done: false },
      { label: 'Default to graciousness under stress', done: false },
    ],
  },
  {
    id: 2,
    title: 'The Dot and The Line',
    type: 'Main Quest',
    status: 'active',
    image: require('../../assets/images/Banners/IMG_6878.jpg'),
    location: 'The Studio',
    objective: 'Earn discipline through craft',
    details:
      'The line wanted the dot but had nothing to offer beyond what it was. So it learned to bend, fold, compose — to become worthy by becoming more. Choose the harder, more deliberate form every time.',
    tasks: [
      { label: 'Show up daily', done: false },
      { label: 'Refuse the easy line', done: false },
      { label: 'Compose something only you could make', done: false },
    ],
  },
  {
    id: 1,
    title: 'Without The Rope',
    type: 'Main Quest',
    status: 'active',
    image: require('../../assets/images/Banners/IMG_6849.jpg'),
    location: 'Everywhere',
    objective: 'Operate without safety nets',
    details:
      'The rope is every fallback, every excuse, every soft landing waiting to catch you. Climb without it. Make decisions whose consequences you have to wear. Stop pre-engineering the escape hatch.',
    tasks: [
      { label: 'Identify the rope', done: false },
      { label: 'Cut one strand a week', done: false },
      { label: 'Sit with the exposure', done: false },
    ],
  },

  // ── SIDE QUESTS ──
  {
    id: 4,
    title: 'Pest Control',
    type: 'Bounty',
    status: 'completed',
    location: 'Industrial Zone, Block 9',
    objective: 'Eliminate the drone swarm terrorizing workers',
    details:
      'A malfunctioning drone swarm has been harassing factory workers in Block 9. Someone reprogrammed their patrol routes to target civilians. The factory foreman is offering good money to anyone who can shut them down.',
    tasks: [
      { label: 'Travel to Block 9', done: true },
      { label: 'Locate the drone control node', done: true },
      { label: 'Destroy or disable the swarm', done: true },
      { label: 'Report back to the foreman', done: true },
    ],
  },
  {
    id: 5,
    title: 'The Collector',
    type: 'Side Quest',
    status: 'completed',
    location: 'Old Market, Level 2',
    objective: 'Find and deliver the three pre-war artifacts',
    details:
      'An eccentric collector in the Old Market is paying top dollar for pre-war relics. Three specific items: a military badge, a circuit board from a defunct satellite, and a sealed data core.',
    tasks: [
      { label: 'Find the military badge', done: true },
      { label: 'Recover the satellite circuit board', done: true },
      { label: 'Extract the sealed data core', done: true },
      { label: 'Deliver all items to the collector', done: true },
    ],
  },
  {
    id: 6,
    title: 'Wrong Turn',
    type: 'Errand',
    status: 'failed',
    location: 'Transit Hub, Line 4',
    objective: 'Escort the courier through hostile territory',
    details:
      "A courier needed safe passage through Line 4. The route was supposed to be clear. It wasn't.",
    tasks: [
      { label: 'Meet the courier at the station', done: true },
      { label: 'Clear the route through Line 4', done: true },
      { label: 'Deliver the courier safely', done: false },
    ],
  },
  {
    id: 7,
    title: 'Blackout',
    type: 'Bounty',
    status: 'active',
    location: 'Power Grid, Substation 12',
    objective: 'Restore power to the residential block',
    details:
      'Someone is siphoning power from Substation 12, leaving three residential blocks in the dark. Find who is responsible and put a stop to it. The residents are getting desperate.',
    tasks: [
      { label: 'Investigate Substation 12', done: true },
      { label: 'Trace the unauthorized power line', done: false },
      { label: 'Confront the perpetrator', done: false },
    ],
  },
  {
    id: 8,
    title: 'Supply Run',
    type: 'Errand',
    status: 'active',
    location: 'Warehouse District',
    objective: 'Secure medical supplies from the abandoned warehouse',
    details:
      'The clinic is running low on critical supplies. An abandoned warehouse on the east side supposedly has a cache of pre-war medical equipment. Get in, grab what you can, get out.',
    tasks: [
      { label: 'Reach the warehouse', done: false },
      { label: 'Search for medical supplies', done: false },
      { label: 'Return supplies to the clinic', done: false },
    ],
  },
];
