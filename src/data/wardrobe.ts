export type Category =
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Shoes'
  | 'Accessories';

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'All';

export type ItemStatus = 'owned' | 'wishlist';

export interface WardrobeItem {
  id: number;
  category: Category;
  color: string;
  swatch: string;
  season: Season;
  brand: string;
  status: ItemStatus;
}

export const wardrobeItems: WardrobeItem[] = [
  {
    id: 1,
    category: 'Tops',
    color: 'Bone',
    swatch: '#E8E2D6',
    season: 'All',
    brand: 'Uniqlo',
    status: 'owned',
  },
  {
    id: 2,
    category: 'Tops',
    color: 'Charcoal',
    swatch: '#2E2E30',
    season: 'All',
    brand: 'Lady White Co.',
    status: 'owned',
  },
  {
    id: 3,
    category: 'Bottoms',
    color: 'Indigo',
    swatch: '#1F2A40',
    season: 'All',
    brand: 'A.P.C.',
    status: 'owned',
  },
  {
    id: 4,
    category: 'Bottoms',
    color: 'Olive',
    swatch: '#4A4B2A',
    season: 'Fall',
    brand: 'Stan Ray',
    status: 'owned',
  },
  {
    id: 5,
    category: 'Outerwear',
    color: 'Black',
    swatch: '#0E0E0E',
    season: 'Winter',
    brand: 'Arc’teryx',
    status: 'owned',
  },
  {
    id: 6,
    category: 'Shoes',
    color: 'White',
    swatch: '#F1EFEA',
    season: 'All',
    brand: 'Common Projects',
    status: 'owned',
  },
  {
    id: 7,
    category: 'Accessories',
    color: 'Tan',
    swatch: '#B79A75',
    season: 'All',
    brand: 'Hender Scheme',
    status: 'owned',
  },
  {
    id: 8,
    category: 'Outerwear',
    color: 'Stone',
    swatch: '#9C948A',
    season: 'Fall',
    brand: 'Auralee',
    status: 'wishlist',
  },
  {
    id: 9,
    category: 'Tops',
    color: 'Cream',
    swatch: '#F0EADA',
    season: 'Spring',
    brand: 'Margaret Howell',
    status: 'wishlist',
  },
  {
    id: 10,
    category: 'Bottoms',
    color: 'Black',
    swatch: '#101010',
    season: 'All',
    brand: 'Our Legacy',
    status: 'wishlist',
  },
  {
    id: 11,
    category: 'Shoes',
    color: 'Brown',
    swatch: '#5A3A26',
    season: 'Fall',
    brand: 'Paraboot',
    status: 'wishlist',
  },
  {
    id: 12,
    category: 'Accessories',
    color: 'Navy',
    swatch: '#1B2440',
    season: 'Winter',
    brand: 'Drake’s',
    status: 'wishlist',
  },
];
