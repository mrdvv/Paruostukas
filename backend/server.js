import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes.js'


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


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});