import DailyNutrition from '../../models/dailyNutrition.js';

const getDailyMeals = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { date } = req.body;

    // Kullanıcı kontrolü
    if (!userId) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    // Tarih kontrolü
    if (!date || typeof date !== 'string') {
      return res.status(400).json({
        message: 'A valid date is required.',
      });
    }

    // YYYY-MM-DD biçimindeki tarihi kontrol et
    const datePart = date.slice(0, 10);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) {
      return res.status(400).json({
        message: 'Invalid date format. Use YYYY-MM-DD.',
      });
    }

    const startDate = new Date(`${datePart}T00:00:00.000Z`);

    if (startDate.toISOString().slice(0, 10) !== datePart) {
      return res.status(400).json({
        message: 'Invalid calendar date.',
      });
    }

    // Seçilen günün başlangıç ve bitiş saatleri
    const endDate = new Date(startDate);
    endDate.setUTCDate(endDate.getUTCDate() + 1);

    // Yalnızca giriş yapan kullanıcının o güne ait öğünlerini getir
    const meals = await DailyNutrition.find({
      owner: userId,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    }).sort({ createdAt: 1 });

    return res.status(200).json(meals);
  } catch (error) {
    return res.status(500).json({
      message: 'Unable to retrieve daily meals.',
    });
  }
};

export default getDailyMeals;
