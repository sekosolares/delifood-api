import express, { Request, Response } from 'express';
import { IUnitProduct } from './product.interface';
import * as database from './product.database';
import * as dbCategory from '../categories/category.database';
import { StatusCodes } from 'http-status-codes';

export const productRouter = express.Router();

database.initializeProducts();

productRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const allProducts: IUnitProduct[] = await database.getAll();

    if(!allProducts) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Products not found...' }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        count: allProducts.length,
        products: allProducts
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

productRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await database.getById(id);

    if(!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Product not found...' }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: product
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

productRouter.post('/products', async (req: Request, res: Response) => {
  try {
    const { name, description, price, quantity, image, categoryId } = req.body;

    if(!name || !price || !quantity || !image || !categoryId || !description) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: {
          error: 'Please provide all required parameters...',
          requiredFields: [
            'name', 'price', 'quantity',
            'image', 'categoryId', 'description'
          ]
        }
      });
    }

    const existsCategory = await dbCategory.getById(categoryId);

    if(!existsCategory) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Category with that Id was not found...' }
      });
    }

    const existsProduct = await database.getByName(name);

    if(existsProduct) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: { error: 'Product with that name already exists...' }
      });
    }

    const newProduct = await database.create(req.body);
    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: { product: newProduct }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

productRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const newProduct = req.body;
    const product = await database.getById(id);

    if(!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Product not found...' }
      });
    }

    const updateProduct = await database.update(id, newProduct);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        product: updateProduct
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

productRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await database.getById(id);

    if(!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Product not found...' }
      });
    }

    const removedProduct = await database.remove(id);
    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        removedProduct
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});
