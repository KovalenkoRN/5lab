import React from 'react';

// Список доступных категорий fakestoreapi
const CATEGORIES = [
  { value: 'electronics', label: 'Электроника' },
  { value: 'jewelery', label: 'Ювелирные изделия' },
  { value: "men's clothing", label: 'Мужская одежда' },
  { value: "women's clothing", label: 'Женская одежда' },
];

// Компонент фильтров («контролируемые компоненты»).
// Хранит введённые значения локально и отдаёт их родителю только по кнопке «Применить».
// Самостоятельная работа:
//  1) выбор нескольких категорий — массив в useState (localCategories);
//  2) ползунки (range input) для минимальной и максимальной стоимости.
export function Filters({ onFilterChange, initialFilters, priceLimit = 1000 }) {
  const [localCategories, setLocalCategories] = React.useState(initialFilters.categories || []);
  const [localMinPrice, setLocalMinPrice] = React.useState(
    initialFilters.minPrice !== undefined ? String(initialFilters.minPrice) : ''
  );
  const [localMaxPrice, setLocalMaxPrice] = React.useState(
    initialFilters.maxPrice !== undefined ? String(initialFilters.maxPrice) : ''
  );

  // Ошибки валидации
  const [errors, setErrors] = React.useState({});

  const validate = () => {
    const errs = {};
    const min = localMinPrice !== '' ? Number(localMinPrice) : undefined;
    const max = localMaxPrice !== '' ? Number(localMaxPrice) : undefined;

    // Проверка на отрицательные значения
    if (min !== undefined && min < 0) {
      errs.min = 'Цена не может быть отрицательной';
    }
    if (max !== undefined && max < 0) {
      errs.max = 'Цена не может быть отрицательной';
    }
    // Проверка диапазона: только если оба поля заполнены и оба валидны
    if (min !== undefined && max !== undefined && min >= 0 && max >= 0 && min > max) {
      errs.min = 'Цена «от» не может быть больше цены «до»';
      errs.max = 'Цена «до» не может быть меньше цены «от»';
    }
    return errs;
  };

  const handleApply = () => {
    const errs = validate();
    setErrors(errs);
    // Если есть ошибки — не отправляем фильтры
    if (Object.keys(errs).length > 0) return;

    onFilterChange({
      categories: localCategories, // пустой массив = все категории
      minPrice: localMinPrice !== '' ? Number(localMinPrice) : undefined,
      maxPrice: localMaxPrice !== '' ? Number(localMaxPrice) : undefined,
    });
  };

  const handleReset = () => {
    setLocalCategories([]);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setErrors({});
    onFilterChange({ categories: [], minPrice: undefined, maxPrice: undefined });
  };

  // Добавляет / убирает категорию из массива выбранных
  const toggleCategory = (value) => {
    setLocalCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  // Сбрасываем ошибку поля при ручном изменении,
  // чтобы она не висела после того, как пользователь начал исправлять значение
  const handleMinChange = (e) => {
    setLocalMinPrice(e.target.value);
    setErrors((prev) => ({ ...prev, min: '' }));
  };

  const handleMaxChange = (e) => {
    setLocalMaxPrice(e.target.value);
    setErrors((prev) => ({ ...prev, max: '' }));
  };

  // Значения для ползунков: если поле пустое — крайнее положение
  const sliderMin = localMinPrice !== '' && Number(localMinPrice) >= 0 ? Math.min(Number(localMinPrice), priceLimit) : 0;
  const sliderMax = localMaxPrice !== '' && Number(localMaxPrice) >= 0 ? Math.min(Number(localMaxPrice), priceLimit) : priceLimit;

  const inputStyle = (hasError) => ({
    width: '100%',
    padding: '8px',
    border: hasError ? '1px solid red' : '1px solid #ccc',
    borderRadius: '4px',
    boxSizing: 'border-box',
  });

  const errorStyle = { color: 'red', fontSize: '0.85rem', marginTop: '4px', display: 'block' };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        {/* Несколько категорий — чекбоксы, значения хранятся массивом */}
        <fieldset style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '8px 12px', margin: 0 }}>
          <legend>Категории</legend>
          {CATEGORIES.map((cat) => (
            <label key={cat.value} style={{ display: 'block', cursor: 'pointer', marginBottom: '4px' }}>
              <input
                type="checkbox"
                checked={localCategories.includes(cat.value)}
                onChange={() => toggleCategory(cat.value)}
                style={{ marginRight: '6px' }}
              />
              {cat.label}
            </label>
          ))}
          <small style={{ color: '#777' }}>
            {localCategories.length === 0 ? 'Не выбрано — показываются все' : `Выбрано: ${localCategories.length}`}
          </small>
        </fieldset>

        <div>
          <label htmlFor="minPrice">Цена от</label>
          <input
            id="minPrice"
            type="number"
            value={localMinPrice}
            onChange={handleMinChange}
            placeholder="0"
            min="0"
            style={inputStyle(errors.min)}
          />
          {/* Ползунок для минимальной стоимости */}
          <input
            type="range"
            aria-label="Ползунок минимальной цены"
            min="0"
            max={priceLimit}
            step="1"
            value={sliderMin}
            onChange={handleMinChange}
            style={{ width: '100%', marginTop: '8px' }}
          />
          {errors.min && <span style={errorStyle}>{errors.min}</span>}
        </div>

        <div>
          <label htmlFor="maxPrice">Цена до</label>
          <input
            id="maxPrice"
            type="number"
            value={localMaxPrice}
            onChange={handleMaxChange}
            placeholder={String(priceLimit)}
            min="0"
            style={inputStyle(errors.max)}
          />
          {/* Ползунок для максимальной стоимости */}
          <input
            type="range"
            aria-label="Ползунок максимальной цены"
            min="0"
            max={priceLimit}
            step="1"
            value={sliderMax}
            onChange={handleMaxChange}
            style={{ width: '100%', marginTop: '8px' }}
          />
          {errors.max && <span style={errorStyle}>{errors.max}</span>}
        </div>
      </div>

      <button
        onClick={handleApply}
        style={{
          padding: '10px 24px',
          background: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Применить фильтры
      </button>
      <button
        onClick={handleReset}
        style={{
          padding: '10px 24px',
          marginLeft: '0.75rem',
          background: 'white',
          color: '#2563eb',
          border: '1px solid #2563eb',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Сбросить
      </button>
    </div>
  );
}
