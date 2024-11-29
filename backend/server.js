import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'
import productRoutes from './routes/productRoutes.js'
import cartRoutes from './routes/cartRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
import categoryRoutes from './routes/categoryRoutes.js'
dotenv.config()

const port = 8000;
const app = express();

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log('MongoDB no connection', err))

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

//routes

app.use('/api', authRoutes);
app.use('/api/', productRoutes);
app.use('/api/', cartRoutes);
app.use('/api/', checkoutRoutes);
app.use('/api/', categoryRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});