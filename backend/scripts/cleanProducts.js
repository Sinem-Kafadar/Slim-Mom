import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, 'products.json');
const outputPath = path.join(__dirname, 'products.cleaned.json');

try {
  // Orijinal ürün dosyasını oku.
  const rawData = JSON.parse(
    fs.readFileSync(inputPath, 'utf-8')
  );

  if (!Array.isArray(rawData)) {
    throw new Error('Products data must be a JSON array.');
  }

  // Ürün kayıtlarını düzenle.
  const cleanedData = rawData.map((product, index) => {
    if (
      !product ||
      typeof product !== 'object' ||
      Array.isArray(product)
    ) {
      throw new Error(
        `Invalid product at position ${index}.`
      );
    }

    const cleanedProduct = { ...product };

    // MongoDB Extended JSON kimliğini normalleştir.
    if (
      cleanedProduct._id &&
      typeof cleanedProduct._id === 'object' &&
      cleanedProduct._id.$oid
    ) {
      cleanedProduct._id = cleanedProduct._id.$oid;
    }

    // Mongoose sürüm alanını ürün verisinden çıkar.
    delete cleanedProduct.__v;

    return cleanedProduct;
  });

  // Orijinal dosyaya dokunmadan yeni dosyaya yaz.
  fs.writeFileSync(
    outputPath,
    JSON.stringify(cleanedData, null, 2),
    'utf-8'
  );

  console.log('✅ Product data cleaned successfully!');
  console.log(`📦 Total products: ${cleanedData.length}`);
  console.log(`📁 Output file: ${outputPath}`);
} catch (error) {
  console.error('❌ Product cleaning failed:', error.message);
  process.exitCode = 1;
}
