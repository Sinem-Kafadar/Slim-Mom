import mongoose from 'mongoose';
import DailyNutrition from '../../models/dailyNutrition.js';

const removeMeal = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { mealId } = req.params;

    // Kullanıcı kontrolü
    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    // Öğün ID kontrolü
    if (!mongoose.isValidObjectId(mealId)) {
      return res.status(400).json({
        message: 'Invalid meal ID.',
      });
    }

    // Yalnızca giriş yapan kullanıcının kendi öğününü sil
    const deletedMeal = await DailyNutrition.findOneAndDelete({
      _id: mealId,
      owner: userId,
    });

    if (!deletedMeal) {
      return res.status(404).json({
        message: 'Meal not found.',
      });
    }

    return res.status(200).json({
      message: 'Meal deleted successfully.',
      mealId: deletedMeal._id,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to delete meal.',
    });
  }
};

export default removeMeal;
