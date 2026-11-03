import 'dotenv/config';

import dns from 'node:dns';
import mongoose from 'mongoose';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import Product from '../models/product.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const importProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing from backend/.env');
    }

    // Temizlenmiş ürün dosyasını oku.
    const cleanedPath = path.join(
      __dirname,
      'products.cleaned.json'
    );

    const originalPath = path.join(
      __dirname,
      'products.json'
    );

    const filePath = fs.existsSync(cleanedPath)
      ? cleanedPath
      : originalPath;

    if (!fs.existsSync(filePath)) {
      throw new Error('Products JSON file was not found.');
    }

    const data = JSON.parse(
      fs.readFileSync(filePath, 'utf-8')
    );

    if (!Array.isArray(data)) {
      throw new Error('Products data must be an array.');
    }

    const validProducts = [];
    const invalidProducts = [];

    // Ürünleri doğrula ve modelimize uygun hâle getir.
    data.forEach((item, index) => {
      const isValid =
        item &&
        typeof item === 'object' &&
        typeof item.title === 'string' &&
        item.title.trim().length > 0 &&
        (typeof item.categories === 'string' ||
          Array.isArray(item.categories)) &&
        Number.isFinite(Number(item.weight)) &&
        Number(item.weight) > 0 &&
        Number.isFinite(Number(item.calories)) &&
        Number(item.calories) >= 0 &&
        Array.isArray(item.groupBloodNotAllowed);

      if (!isValid) {
        invalidProducts.push({
          index,
          item,
        });
        return;
      }

      validProducts.push({
        categories: Array.isArray(item.categories)
          ? item.categories
          : [item.categories],

        weight: Number(item.weight),
        title: item.title.trim(),
        calories: Number(item.calories),

        groupBloodNotAllowed: item.groupBloodNotAllowed,
      });
    });

    console.log(`Total products: ${data.length}`);
    console.log(`Valid products: ${validProducts.length}`);
    console.log(`Invalid products: ${invalidProducts.length}`);

    if (validProducts.length === 0) {
      throw new Error('No valid products were found.');
    }

    // MongoDB bağlantısını kur.
    await mongoose.connect(mongoUri);

    console.log('✅ Connected to MongoDB Atlas.');

    // Ürünleri başlık, ağırlık ve kalori değerlerine göre
    // güncelle veya yoksa ekle. Tekrar çalıştırıldığında
    // aynı ürünleri çoğaltmaz.
    const batchSize = 1000;

    for (
      let start = 0;
      start < validProducts.length;
      start += batchSize
    ) {
      const batch = validProducts.slice(
        start,
        start + batchSize
      );

      const operations = batch.map(product => ({
        updateOne: {
          filter: {
            title: product.title,
            weight: product.weight,
            calories: product.calories,
          },
          update: {
            $set: product,
          },
          upsert: true,
        },
      }));

      await Product.bulkWrite(operations, {
        ordered: false,
      });

      console.log(
        `Imported batch: ${Math.min(
          start + batch.length,
          validProducts.length
        )} / ${validProducts.length}`
      );
    }

    // Geçersiz kayıtları ayrı dosyaya kaydet.
    const invalidPath = path.join(
      __dirname,
      'invalidProducts.json'
    );

    fs.writeFileSync(
      invalidPath,
      JSON.stringify(invalidProducts, null, 2),
      'utf-8'
    );

    const finalCount = await Product.countDocuments();

    console.log('✅ Product import completed!');
    console.log(`📦 Products in database: ${finalCount}`);
  } catch (error) {
    console.error('❌ Product import failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

importProducts();
