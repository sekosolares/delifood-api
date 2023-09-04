import express, { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { userRouter } from './users/user.routes';
import { productRouter } from './products/product.routes';
import { categoryRouter } from './categories/category.routes';

dotenv.config();

if(!process.env.PORT) {
  console.log('No port value specified...');
}

const PORT = isNaN(parseInt(process.env.PORT as string, 10)) ? 8080 : parseInt(process.env.PORT as string, 10);

const app = express();

const allowedOrigins = [
  'http://localhost:8080',
  'http://127.0.0.1:5500',
  'https://micro-ecommerce.onrender.com',
  'https://sekosolares.github.io'
];

const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet());

app.use('/', userRouter);
app.use('/', productRouter);
app.use('/', categoryRouter);

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
