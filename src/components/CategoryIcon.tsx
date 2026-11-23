import {
  Beef,
  CakeSlice,
  CirclePlus,
  Coffee,
  Flame,
  GlassWater,
  IceCreamCone,
  Layers,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Sparkles,
  Sun,
  Utensils,
  UtensilsCrossed,
} from 'lucide-react';
import type { CategoryIconName } from '../types/menu';

export const CATEGORY_ICON_OPTIONS: { name: CategoryIconName; label: string }[] = [
  { name: 'Utensils', label: 'Cubiertos' },
  { name: 'Flame', label: 'Parrilla / Fuego' },
  { name: 'Beef', label: 'Carnes / Asados' },
  { name: 'Layers', label: 'Picadas / Capas' },
  { name: 'Sparkles', label: 'Especiales' },
  { name: 'Sun', label: 'Patacones / Caribe' },
  { name: 'GlassWater', label: 'Bebidas' },
  { name: 'PlusCircle', label: 'Adicionales' },
  { name: 'IceCreamCone', label: 'Heladería' },
  { name: 'Pizza', label: 'Pizza / Rápidas' },
  { name: 'Sandwich', label: 'Sándwiches' },
  { name: 'Coffee', label: 'Café / Calientes' },
  { name: 'CakeSlice', label: 'Postres' },
  { name: 'Soup', label: 'Sopas / Cazuelas' },
  { name: 'Salad', label: 'Ensaladas' },
];

interface CategoryIconProps {
  iconName: CategoryIconName;
  className?: string;
  useCrossedForUtensils?: boolean;
}

export function CategoryIcon({
  iconName,
  className = 'w-4 h-4',
  useCrossedForUtensils = false,
}: CategoryIconProps) {
  switch (iconName) {
    case 'Utensils':
      return useCrossedForUtensils ? (
        <UtensilsCrossed className={className} />
      ) : (
        <Utensils className={className} />
      );
    case 'Flame':
      return <Flame className={className} />;
    case 'Beef':
      return <Beef className={className} />;
    case 'Layers':
      return <Layers className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'GlassWater':
      return <GlassWater className={className} />;
    case 'PlusCircle':
      return <CirclePlus className={className} />;
    case 'IceCreamCone':
      return <IceCreamCone className={className} />;
    case 'Pizza':
      return <Pizza className={className} />;
    case 'Coffee':
      return <Coffee className={className} />;
    case 'Sandwich':
      return <Sandwich className={className} />;
    case 'CakeSlice':
      return <CakeSlice className={className} />;
    case 'Soup':
      return <Soup className={className} />;
    case 'Salad':
      return <Salad className={className} />;
    default:
      return useCrossedForUtensils ? (
        <UtensilsCrossed className={className} />
      ) : (
        <Utensils className={className} />
      );
  }
}
