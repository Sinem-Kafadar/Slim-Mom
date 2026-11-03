import { Router } from 'express';
import authenticate from '../../middlewares/authenticate.js';
import addMeal from '../../controllers/dailyNutritions/addMeal.js';
import getDailyMeals from '../../controllers/dailyNutritions/getDailyMeals.js';
import removeMeal from '../../controllers/dailyNutritions/removeMeal.js';

const router = Router();

// Tüm günlük beslenme işlemleri giriş gerektirir.
router.use(authenticate);

// Günlük öğünleri getir
router.post('/getdailymeals', getDailyMeals);

// Günlüğe öğün ekle
router.post('/addmeal', addMeal);

// Günlükten öğün sil
router.delete('/:mealId', removeMeal);

export default router;
