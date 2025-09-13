export interface MarketplaceItem {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string; // SVG content
  price: {
    base: number;
    storagePerGB: number;
    ramPerGB: number;
    bandwidthPerTB: number;
  };
  osOptions: string[];
  rating: number;
  reviews: number;
  badge?: 'spotlight' | 'bestseller';
  provider?: string;
  downloads?: number;
  fortified?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string; // SVG content
}
