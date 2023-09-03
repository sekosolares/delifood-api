export interface ICategory {
  name: string;
  description?: string;
  image?: string;
  imageUrl?: string;
}

export interface IUnitCategory extends ICategory {
  id: string;
  createdAt: Date;
  isActive: boolean;
}

export interface ICategories {
  [key: string]: IUnitCategory;
}