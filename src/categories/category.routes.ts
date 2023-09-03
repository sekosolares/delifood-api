import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as dbCategory from './category.database';
import { IUnitCategory } from './category.interface';

export const categoryRouter = express.Router();

dbCategory.initializeCategories();

categoryRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories: IUnitCategory[] = await dbCategory.getAll();

    if(!categories) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'No categories found...' }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        count: categories.length,
        categories
      }
    });
  } catch(err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

categoryRouter.get('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await dbCategory.getById(id);

    if(!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Category not found...' }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        category
      }
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

categoryRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if(!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: {
          error: 'Please provide all required fields...',
          requiredFields: ['name']
        }
      });
    }

    const existingCategory = await dbCategory.getByName(name);

    if(existingCategory) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: { error: 'Category with that name already exists...' }
      });
    }

    const newCategory = await dbCategory.create(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        category: newCategory
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

categoryRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCategory = await dbCategory.getById(id);

    if(!existingCategory) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Category not found...' }
      });
    }

    const updatedCategory = await dbCategory.update(id, req.body);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        category: updatedCategory
      }
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

categoryRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryToDelete = await dbCategory.getById(id);

    if(!categoryToDelete) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'Category not found...' }
      });
    }

    const deletedCategory = await dbCategory.remove(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        deletedCategory
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
})
