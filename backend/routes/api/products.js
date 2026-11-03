import express from 'express';
import authenticate from '../../middlewares/authenticate.js';
import Product from '../../models/product.js';

const router = express.Router();

// Ürün arama
router.get('/', authenticate, async (req, res, next) => {
  try {
    const query =
      typeof req.query.q === 'string'
        ? req.query.q.trim()
        : '';

    if (!query) {
      return res.status(400).json({
        message: "Query parameter 'q' is required.",
      });
    }

    if (query.length > 100) {
      return res.status(400).json({
        message: 'Search query is too long.',
      });
    }

    // Regex özel karakterlerini etkisizleştir.
    const escapedQuery = query.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    );

    const products = await Product.find(
      {
        title: {
          $regex: escapedQuery,
          $options: 'i',
        },
      },
      {
        title: 1,
        weight: 1,
        calories: 1,
      }
    )
      .limit(20)
      .lean();

    return res.status(200).json(products);
  } catch (error) {
    return next(error);
  }
});

export default router;
