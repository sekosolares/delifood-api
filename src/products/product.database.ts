import { IProduct, IProducts, IUnitProduct } from './product.interface';
import { v4 as random } from 'uuid';
import fs from 'fs';

const FILENAME = './products.json';

export function initializeProducts() {

  // Check if the file exists
  if (!fs.existsSync(FILENAME)) {
    // Create the file
    fs.writeFileSync(FILENAME, '{}', 'utf8');
    console.log('Products.json created successfully!');
  }
}

function loadProducts(): IProducts {
  try {
    const data = fs.readFileSync(FILENAME, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error loading products. Error: ${e}`);
    return {}
  }
}

function saveProducts() {
  try {
    fs.writeFileSync(FILENAME, JSON.stringify(products), 'utf8');
    console.log(`Products saved successfully`);
  } catch (err) {
    console.log(`Error saving products. Error: ${err}`);
  }
}

let products: IProducts = loadProducts();


export const getAll = async (): Promise<IUnitProduct[]> => Object.values(products);

export const getById = async (id: string): Promise<IUnitProduct> => products[id];

export const getByName = async (name: string): Promise<IUnitProduct | null> => {
  const allProducts = await getAll();
  const foundProduct = allProducts.find(product => product.name.toLowerCase() === name.toLowerCase());

  if(!foundProduct) {
    return null;
  }

  return foundProduct;
}

export const create = async (productInfo: IProduct): Promise<IUnitProduct|null> => {
  let id = random();
  let checkProduct = await getById(id);

  while(checkProduct) {
    id = random();
    checkProduct = await getById(id);
  }

  products[id] = {
    id,
    name: productInfo.name,
    description: productInfo.description,
    price: productInfo.price,
    quantity: productInfo.quantity,
    image: productInfo.image,
    categoryId: productInfo.categoryId,
    createdAt: new Date(),
    isActive: true
  };

  saveProducts();

  return products[id];
};

export const update = async (id: string, updateValues: IProduct): Promise<IUnitProduct|null> => {
  const product = await getById(id);

  if(!product) {
    return null;
  }

  products[id] = {
    ...product,
    ...updateValues
  };

  saveProducts();

  return products[id];
};

export const remove = async (id: string): Promise<IUnitProduct|null> => {
  const productToRemove = await getById(id);

  if(!productToRemove) {
    return null;
  }

  delete products[id];
  saveProducts();

  return productToRemove;
};


