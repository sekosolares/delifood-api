export interface IProduct {
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  categoryId: string;
}

export interface IUnitProduct extends IProduct {
  id: string;
  createdAt: Date;
  isActive: boolean;
}

export interface IProducts {
  [key: string]: IUnitProduct;
}
