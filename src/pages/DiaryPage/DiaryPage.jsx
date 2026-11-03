import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getProductsByQuery,
  getDailyMeals,
  addMeal,
  deleteMeal,
} from '../../redux/products/products-operations.js';

import { setDate } from '../../redux/products/products-slice.js';

import {
  selectDailyCalories,
  selectNotAllowedProducts,
} from '../../redux/auth/auth-selector.js';

import styles from './DiaryPage.module.css';

// Yerel tarih: YYYY-MM-DD
function getLocalDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(now.getTime() - offset * 60000)
    .toISOString()
    .slice(0, 10);
}

function DiaryPage() {
  const dispatch = useDispatch();

  // Redux ürün bilgileri
  const {
    productsOptions = [],
    dailyMeals = [],
    isLoading = false,
    error: apiError = '',
  } = useSelector(state => state.products);

  // Kullanıcının günlük kalori bilgileri
  const dailyCalories = useSelector(selectDailyCalories);
  const notAllowedProducts = useSelector(selectNotAllowedProducts);

  // Yerel form bilgileri
  const [selectedDate, setSelectedDate] = useState(getLocalDate);
  const [productQuery, setProductQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState('');

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Günlük öğünleri getir
  useEffect(() => {
    dispatch(setDate(selectedDate));
    dispatch(getDailyMeals({ date: selectedDate }));
  }, [dispatch, selectedDate]);

  // Ürün arama
  useEffect(() => {
    const query = productQuery.trim();

    if (selectedProduct || query.length < 2) {
      return;
    }

    const timeout = setTimeout(() => {
      dispatch(getProductsByQuery(query));
    }, 350);

    return () => clearTimeout(timeout);
  }, [productQuery, selectedProduct, dispatch]);

  // Günlük toplam tüketilen kalori
  const totalCalories = useMemo(() => {
    return dailyMeals.reduce(
      (total, meal) => total + Number(meal.calories || 0),
      0
    );
  }, [dailyMeals]);

  // Günlük kalori hedefi
  const dailyRate =
    dailyCalories !== null &&
    dailyCalories !== undefined &&
    Number.isFinite(Number(dailyCalories)) &&
    Number(dailyCalories) > 0
      ? Number(dailyCalories)
      : null;

  // Kalan kalori
  const caloriesLeft =
    dailyRate !== null
      ? Math.max(dailyRate - totalCalories, 0)
      : null;

  // Günlük hedefin tüketilen yüzdesi
  const percentageOfNormal =
    dailyRate !== null
      ? (totalCalories / dailyRate) * 100
      : null;

  // Tarih biçimi
  const formattedDate = new Date(
    `${selectedDate}T12:00:00`
  ).toLocaleDateString('en-GB');

  // Ürün önerileri
  const filteredProducts = useMemo(() => {
    if (
      productQuery.trim().length < 2 ||
      selectedProduct
    ) {
      return [];
    }

    return productsOptions.slice(0, 6);
  }, [productsOptions, productQuery, selectedProduct]);

  // Ürün arama alanı
  const handleProductChange = event => {
    setProductQuery(event.target.value);
    setSelectedProduct(null);
    setFormError('');
  };

  // Ürün seçme
  const handleProductSelect = product => {
    setSelectedProduct(product);
    setProductQuery(product.title);
    setFormError('');
  };

  // Öğün ekleme
  const handleAddMeal = async event => {
    event.preventDefault();
    setFormError('');

    if (!selectedProduct) {
      setFormError('Please select a product from the suggestions.');
      return;
    }

    const gramsValue = Number(grams);

    if (
      !Number.isFinite(gramsValue) ||
      gramsValue <= 0 ||
      gramsValue > 3000
    ) {
      setFormError('Please enter a valid amount of grams.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(
        addMeal({
          date: selectedDate,
          product: selectedProduct.title,
          grams: gramsValue,
        })
      ).unwrap();

      // Başarılı kayıt sonrası formu temizle
      setProductQuery('');
      setSelectedProduct(null);
      setGrams('');
    } catch (error) {
      setFormError(
        typeof error === 'string'
          ? error
          : 'Unable to add product. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Öğün silme
  const handleDeleteMeal = async mealId => {
    setFormError('');

    try {
      await dispatch(deleteMeal(mealId)).unwrap();
    } catch (error) {
      setFormError(
        typeof error === 'string'
          ? error
          : 'Unable to delete this product.'
      );
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.layout}>
        {/* SOL TARAF - DIARY */}
        <section className={styles.diary}>
          <div className={styles.headingRow}>
            <h1 className={styles.title}>Diary</h1>

            <label className={styles.dateLabel}>
              <span>Choose date</span>

              <input
                className={styles.dateInput}
                type="date"
                value={selectedDate}
                max={getLocalDate()}
                onChange={event =>
                  setSelectedDate(event.target.value)
                }
              />
            </label>
          </div>

          {/* Ürün ekleme formu */}
          <form
            className={styles.addForm}
            onSubmit={handleAddMeal}
          >
            <div className={styles.productField}>
              <label htmlFor="diary-product">
                Product name
              </label>

              <input
                id="diary-product"
                className={styles.input}
                type="search"
                value={productQuery}
                onChange={handleProductChange}
                placeholder="Enter product name"
                autoComplete="off"
              />

              {filteredProducts.length > 0 && (
                <ul className={styles.suggestions}>
                  {filteredProducts.map((product, index) => (
                    <li
                      key={
                        product._id ||
                        `${product.title}-${index}`
                      }
                    >
                      <button
                        className={styles.suggestionButton}
                        type="button"
                        onClick={() =>
                          handleProductSelect(product)
                        }
                      >
                        <span>{product.title}</span>

                        <span>
                          {product.calories} kcal / 100 g
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {productQuery.trim().length >= 2 &&
                !selectedProduct &&
                !isLoading &&
                filteredProducts.length === 0 &&
                !apiError && (
                  <p className={styles.emptyMessage}>
                    No matching products found.
                  </p>
                )}
            </div>

            <div className={styles.weightField}>
              <label htmlFor="diary-grams">
                Grams
              </label>

              <input
                id="diary-grams"
                className={styles.input}
                type="number"
                min="1"
                max="3000"
                step="1"
                value={grams}
                onChange={event => {
                  setGrams(event.target.value);
                  setFormError('');
                }}
                placeholder="Grams"
              />
            </div>

            <button
              className={styles.addButton}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add product'}
            </button>
          </form>

          {formError && (
            <p className={styles.error} role="alert">
              {formError}
            </p>
          )}

          {apiError && (
            <p className={styles.error} role="alert">
              {apiError}
            </p>
          )}

          {/* Tüketilen ürünler */}
          <div className={styles.listHeader}>
            <h2>Consumed products</h2>

            <span>{dailyMeals.length} products</span>
          </div>

          {isLoading && dailyMeals.length === 0 ? (
            <p className={styles.emptyMessage}>
              Loading...
            </p>
          ) : dailyMeals.length === 0 ? (
            <p className={styles.emptyMessage}>
              You haven't added any products for this day.
            </p>
          ) : (
            <ul className={styles.mealList}>
              {dailyMeals.map(meal => (
                <li
                  className={styles.mealItem}
                  key={meal._id}
                >
                  <div className={styles.mealName}>
                    {meal.product}
                  </div>

                  <div className={styles.mealGrams}>
                    {meal.grams} g
                  </div>

                  <div className={styles.mealCalories}>
                    {meal.calories} kcal
                  </div>

                  <button
                    className={styles.deleteButton}
                    type="button"
                    onClick={() => handleDeleteMeal(meal._id)}
                    aria-label={`Delete ${meal.product}`}
                    title="Delete product"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* SAĞ TARAF - DAILY SUMMARY */}
        <aside className={styles.sidebar}>
          <section className={styles.summary}>
            <h2>Summary for {formattedDate}</h2>

            <div className={styles.summaryRows}>
              <p className={styles.summaryRow}>
                <span>Left</span>

                <span>
                  {caloriesLeft !== null
                    ? `${caloriesLeft.toFixed(1)} kcal`
                    : '—'}
                </span>
              </p>

              <p className={styles.summaryRow}>
                <span>Consumed</span>

                <span>{totalCalories.toFixed(1)} kcal</span>
              </p>

              <p className={styles.summaryRow}>
                <span>Daily rate</span>

                <span>
                  {dailyRate !== null
                    ? `${dailyRate.toFixed(1)} kcal`
                    : '—'}
                </span>
              </p>

              <p className={styles.summaryRow}>
                <span>% of normal</span>

                <span>
                  {percentageOfNormal !== null
                    ? `${percentageOfNormal.toFixed(2)} %`
                    : '—'}
                </span>
              </p>
            </div>

            {dailyRate === null && (
              <p className={styles.summaryUnavailable}>
                Please calculate your daily calorie intake
                on the Calculator page.
              </p>
            )}
          </section>

          {/* Kan grubuna göre yasaklı ürünler */}
          <section className={styles.foodsSection}>
            <h2 className={styles.foodsTitle}>
              Foods you should not eat
            </h2>

            {notAllowedProducts.length > 0 ? (
              <ul className={styles.notAllowedList}>
                {notAllowedProducts.map((product, index) => (
                  <li
                    className={styles.notAllowedItem}
                    key={
                      product._id ||
                      `${product.title}-${index}`
                    }
                  >
                    {product.title || product}
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.summaryUnavailable}>
                {dailyRate === null
                  ? 'Your food recommendations will appear after calorie calculation.'
                  : 'No restricted products found.'}
              </p>
            )}
          </section>
        </aside>
      </div>
    </main>
  );
}

export default DiaryPage;
