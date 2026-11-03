import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    categories: {
      type: Array,
      required: true,
    },

    weight: {
      type: Number,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    calories: {
      type: Number,
      required: true,
      min: 0,
    },

    groupBloodNotAllowed: {
      type: Array,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

productSchema.index({ title: 1 });

const Product = model('product', productSchema);

export default Product;
