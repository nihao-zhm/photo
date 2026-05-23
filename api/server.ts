import express from 'express';
import cors from 'cors';
import { SearchService } from './searchService';
import { SearchParams } from '../shared/types';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Price Comparison API is running' });
});

app.get('/api/sample', async (req, res) => {
  try {
    const products = await SearchService.getSampleData();
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      total: 0,
      message: 'Failed to fetch sample data'
    });
  }
});

app.post('/api/search', async (req, res) => {
  try {
    const params: SearchParams = req.body;
    
    if (!params.keyword) {
      return res.status(400).json({
        success: false,
        data: [],
        total: 0,
        message: 'Keyword is required'
      });
    }

    const products = await SearchService.search(params);
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      data: [],
      total: 0,
      message: 'Failed to search products'
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
});
