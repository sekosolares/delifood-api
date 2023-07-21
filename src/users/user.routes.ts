import express, { Request, Response } from 'express';
import { IUnitUser } from './user.interface';
import { StatusCodes } from 'http-status-codes';
import * as database from './user.database';

export const userRouter = express.Router();

userRouter.get('/users', async (req: Request, res: Response) => {
  try {
    const allUsers: IUnitUser[] = await database.findAll();

    if(!allUsers) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'No users found...' }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        count: allUsers.length,
        users: allUsers
      }
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    })
  }
});

userRouter.get('/user/:id', async (req: Request, res: Response) => {
  try {
    const user: IUnitUser = await database.findOne(req.params.id);

    if(!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: { error: 'User not found..' }
      })
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

userRouter.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: { error: 'Please provide all required parameters...' }
      });
    }

    const user = await database.findByEmail(email);

    if(user) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: { error: `The email '${email}' has already been taken...` }
      });
    }

    const newUser = await database.create(req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: {
        error: err
      }
    })
  }
});

userRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if(!email || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: {
          error: 'Please provide all required parameters...'
        }
      });
    }

    const user = await database.findByEmail(email);

    if(!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: {
          error: 'User with provided email address does not exist...'
        }
      });
    }

    const comparePassword = await database.comparePassword(email, password);

    if(!comparePassword) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        data: {
          error: 'Incorrect password...'
        }
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        user
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: {
        error: err
      }
    });
  }
});

userRouter.put('/user/:id', async (req: Request, res: Response) => {
  try {
    const { username, password, email } = req.body;

    const getUser = await database.findOne(req.params.id);

    if(!username || !password || !email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        data: { error: 'Please provide all required parameters...' }
      });
    }

    if(!getUser) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: {
          error: 'User not found...'
        }
      });
    }

    const updatedUser = await database.update(req.params.id, req.body);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        user: updatedUser
      }
    })
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});

userRouter.delete('/user/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await database.findOne(id);

    if(!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        data: {
          error: 'User not found...'
        }
      });
    }

    const deletedUser = await database.remove(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: {
        deletedUser
      }
    });
  } catch (err) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      data: { error: err }
    });
  }
});
