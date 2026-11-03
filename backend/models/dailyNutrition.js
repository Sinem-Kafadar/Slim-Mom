import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const dailyNutritionSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
    },

    product: {
      type: String,
      required: true,
      trim: true,
    },

    grams: {
      type: Number,
      required: true,
      min: 0.1,
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

// Kullanıcıya ve tarihe göre günlük kayıtları hızlı bulmak için.
dailyNutritionSchema.index({
  owner: 1,
  date: 1,
});

const DailyNutrition = model(
  'dailyNutrition',
  dailyNutritionSchema
);

export default DailyNutrition;
