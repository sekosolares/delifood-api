import { v4 as random } from 'uuid';
import fs from 'fs';
import { ICategories, IUnitCategory } from './category.interface';

const FILENAME: string = './categories.json';

export function initializeCategories() {
  // Check if the file exists
  if (!fs.existsSync(FILENAME)) {
    // Create the file
    fs.writeFileSync(FILENAME, '{}', 'utf8');
    console.log('categories.json created successfully!');
  }
}

export function loadCategories(): ICategories {
  try {
    const data = fs.readFileSync(FILENAME, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    console.log(`Error loading categories. Error: ${e}`);
    return {}
  }
}

let categories: ICategories = loadCategories();

function saveCategories() {
  try {
    fs.writeFileSync(FILENAME, JSON.stringify(categories), 'utf8');
    console.log(`Categories saved successfully`);
  } catch (err) {
    console.log(`Error saving categories. Error: ${err}`);
  }
}

export const getAll = async (): Promise<IUnitCategory[]> => Object.values(categories);

export const getById = async (id: string): Promise<IUnitCategory> => categories[id];

export const create = async (categoryData: IUnitCategory): Promise<IUnitCategory|null> => {
  let id = random();
  let checkCategory = await getById(id);

  while(checkCategory) {
    id = random();
    checkCategory = await getById(id);
  }

  const creationDate = new Date();

  const category: IUnitCategory = {
    id: id,
    name: categoryData.name,
    description: categoryData.description,
    image: categoryData.image,
    imageUrl: categoryData.imageUrl,
    createdAt: creationDate,
    isActive: true
  };

  categories[id] = category;
  saveCategories();

  return category;
}

export const getByName = async (name: string): Promise<IUnitCategory | null> => {
  const allCategories = await getAll();
  const foundCategory = allCategories.find(category => category.name.toLowerCase() === name.toLowerCase());

  if (!foundCategory) {
    return null;
  }

  return foundCategory;
}

export const update = async (id: string, updateValues: IUnitCategory): Promise<IUnitCategory|null> => {
  const categoryExists = await getById(id);

  if(!categoryExists) {
    return null;
  }

  categories[id] = {
    ...categoryExists,
    ...updateValues
  };

  saveCategories();

  return categories[id];
}

export const remove = async (id: string): Promise<IUnitCategory|null> => {
  const categoryToRemove = await getById(id);

  if(!categoryToRemove) {
    return null;
  }

  delete categories[id];
  saveCategories();

  return categoryToRemove;
}

