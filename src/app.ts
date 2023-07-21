import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './users/user.routes';
import { productRouter } from './products/product.routes';

dotenv.config();

if(!process.env.PORT) {
  console.log('No port value specified...');
}

const PORT = parseInt(process.env.PORT as string, 10);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

app.use('/', userRouter);
app.use('/', productRouter);

app.get('/', (req: Request, res: Response) => {
  return res.status(200).json({
    data: {
      message: 'Welcome to the Micro-ECommerce API!'
    }
  })
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
})
