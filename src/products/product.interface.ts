export interface IProduct {
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IUnitProduct extends IProduct {
  id: string;
}

export interface IProducts {
  [key: string]: IUnitProduct;
}
