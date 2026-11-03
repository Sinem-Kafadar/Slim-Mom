import DailyNutrition from '../../models/dailyNutrition.js';
import Product from '../../models/product.js';

const addMeal = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { date, product, grams } = req.body;

    // Kullanıcı kontrolü
    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    // Alanların kontrolü
    if (!date || !product || grams === undefined) {
      return res.status(400).json({
        message: 'Date, product and grams are required.',
      });
    }

    const mealDate = new Date(date);
    const gramAmount = Number(grams);

    if (Number.isNaN(mealDate.getTime())) {
      return res.status(400).json({
        message: 'Invalid date.',
      });
    }

    if (!Number.isFinite(gramAmount) || gramAmount <= 0) {
      return res.status(400).json({
        message: 'Grams must be a positive number.',
      });
    }

    // Ürünü veritabanında bul
    const foundProduct = await Product.findOne({
      title: product.trim(),
    });

    if (!foundProduct) {
      return res.status(404).json({
        message: 'Product not found.',
      });
    }

    // Kaloriyi girilen gramaja göre hesapla
    const calories = Math.round(
      (gramAmount * foundProduct.calories) / 100
    );

    // Öğünü MongoDB'ye kaydet
    const newMeal = await DailyNutrition.create({
      date: mealDate,
      product: foundProduct.title,
      grams: gramAmount,
      calories,
      owner: userId,
    });

    return res.status(201).json(newMeal);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to add meal.',
    });
  }
};

export default addMeal;
