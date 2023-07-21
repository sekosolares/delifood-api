import { IProduct, IProducts, IUnitProduct } from './product.interface';
import bcrypt from 'bcryptjs';
import { v4 as random } from 'uuid';
import fs from 'fs';


function loadProducts(): IProducts {
  try {
    const data = fs.readFileSync('./products.json', 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error loading products. Error: ${e}`);
    return {}
  }
}

function saveProducts() {
  try {
    fs.writeFileSync('./products.json', JSON.stringify(products), 'utf8');
    console.log(`Products saved successfully`);
  } catch (err) {
    console.log(`Error saving products. Error: ${err}`);
  }
}

let products: IProducts = loadProducts();


export const findAll = async (): Promise<IUnitProduct[]> => Object.values(products);

export const findOne = async (id: string): Promise<IUnitProduct> => products[id];

export const create = async (productInfo: IProduct): Promise<IUnitProduct|null> => {
  let id = random();
  let checkProduct = await findOne(id);

  while(checkProduct) {
    id = random();
    checkProduct = await findOne(id);
  }

  products[id] = {
    id,
    ...productInfo
  };

  saveProducts();

  return products[id];
};

export const update = async (id: string, updateValues: IProduct): Promise<IUnitProduct|null> => {
  const product = await findOne(id);

  if(!product) {
    return null;
  }

  products[id] = {
    id,
    ...updateValues
  };

  saveProducts();

  return products[id];
};

export const remove = async (id: string): Promise<IUnitProduct|null> => {
  const productToRemove = await findOne(id);

  if(!productToRemove) {
    return null;
  }

  delete products[id];
  saveProducts();

  return productToRemove;
};


