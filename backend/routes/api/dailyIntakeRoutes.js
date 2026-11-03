import { Router } from 'express';

import User from '../../models/user.js';
import Product from '../../models/product.js';

import validateBody from '../../middlewares/validateBody.js';
import authenticate from '../../middlewares/authenticate.js';

import { dailyIntakeJoiSchema } from '../../schemas/dailyIntakeJoiSchema.js';

const router = Router();

// Günlük kalori ihtiyacını hesapla.
const calculateCalories = ({ currentWeight, height, age, desiredWeight }) => {
  return (
    10 * currentWeight +
    6.25 * height -
    5 * age -
    161 -
    10 * (currentWeight - desiredWeight)
  );
};

// Kan grubuna göre yenmemesi gereken ürünleri getir.
const getNotAllowedProducts = async bloodType => {
  const products = await Product.find({
    [`groupBloodNotAllowed.${Number(bloodType)}`]: true,
  })
    .select('title')
    .sort({ title: 1 })
    .lean();

  return products;
};

// Herkesin kullanabileceği kalori hesaplama endpoint'i.
// POST /api/daily-intake
router.post('/', validateBody(dailyIntakeJoiSchema), async (req, res) => {
  try {
    const personalData = req.body;

    const calories = calculateCalories(personalData);

    const notAllowedProduct = await getNotAllowedProducts(
      personalData.bloodType
    );

    return res.status(200).json({
      calories: Number(calories.toFixed(1)),
      notAllowedProduct,
    });
  } catch (error) {
    console.error('Daily intake calculation error:', error.message);

    return res.status(500).json({
      message: 'Unable to calculate daily calorie intake.',
    });
  }
});

// Giriş yapan kullanıcı için kalori hesaplama ve kaydetme.
// POST /api/daily-intake/user
router.post(
  '/user',
  authenticate,
  validateBody(dailyIntakeJoiSchema),
  async (req, res) => {
    try {
      const personalData = req.body;

      const calories = calculateCalories(personalData);

      const notAllowedProduct = await getNotAllowedProducts(
        personalData.bloodType
      );

      const dailyDiet = {
        calories: Number(calories.toFixed(1)),
        notAllowedProduct,
      };

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          personalData,
          dailyDiet,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!user) {
        return res.status(404).json({
          message: 'User not found.',
        });
      }

      return res.status(200).json(dailyDiet);
    } catch (error) {
      console.error('User daily intake error:', error.message);

      return res.status(500).json({
        message: 'Unable to save daily calorie intake.',
      });
    }
  }
);

export default router;
