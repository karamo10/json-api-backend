import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import productRoutes from './routes/products.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

app.use('/api/product', productRoutes);


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
