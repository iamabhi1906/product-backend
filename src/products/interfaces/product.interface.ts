export enum ProductCategory {
  GROCERIES = 'groceries',
  HOME_DECORATION = 'home-decoration',
  KITCHEN_ACCESSORIES = 'kitchen-accessories',
  LAPTOPS = 'laptops',
  MENS_SHIRTS = 'mens-shirts',
  MENS_SHOES = 'mens-shoes',
  MENS_WATCHES = 'mens-watches',
  MOBILE_ACCESSORIES = 'mobile-accessories',
  MOTORCYCLE = 'motorcycle',
  SKIN_CARE = 'skin-care',
  SMARTPHONES = 'smartphones',
  SPORTS_ACCESSORIES = 'sports-accessories',
  SUNGLASSES = 'sunglasses',
  TABLETS = 'tablets',
  TOPS = 'tops',
  VEHICLE = 'vehicle',
  WOMENS_BAGS = 'womens-bags',
  WOMENS_DRESSES = 'womens-dresses',
  WOMENS_JEWELLERY = 'womens-jewellery',
}

export enum ProductStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: ProductCategory;
  productImages: string[];
  status: ProductStatus;
  vendorEmail: string;
  vendorName: string;
  createdAt: Date;
  updatedAt: Date;
}
