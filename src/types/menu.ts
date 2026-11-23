export type CategoryIconName =
  | 'Utensils'
  | 'Flame'
  | 'Beef'
  | 'Layers'
  | 'Sparkles'
  | 'Sun'
  | 'GlassWater'
  | 'PlusCircle'
  | 'IceCreamCone'
  | 'Pizza'
  | 'Coffee'
  | 'Sandwich'
  | 'CakeSlice'
  | 'Soup'
  | 'Salad';

export type ProductAvailability = 'available' | 'sold_out' | 'hidden';

export interface Category {
  id: string;
  name: string;
  iconName: CategoryIconName;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  price: number;
  formattedPrice: string;
  description: string;
  imageUrl: string;
  badge?: string;
  serves?: string;
  availability?: ProductAvailability;
}

export interface BibleVerse {
  id: string;
  verse: string;
  reference: string;
  theme: string;
}

export interface CatalogData {
  categories: Category[];
  items: MenuItem[];
  updatedAt: string;
}
