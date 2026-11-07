import React from 'react';

// Заглушка картинки через Data URI (SVG без внешних файлов) — с названием категории
function placeholder(category) {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='120' viewBox='0 0 200 120'%3E%3Crect fill='%23eee' width='200' height='120'/%3E%3Ctext fill='%23999' x='50%25' y='55%25' text-anchor='middle' font-size='16' font-family='sans-serif'%3E${encodeURIComponent(category)}%3C/text%3E%3C/svg%3E`;
}

// Презентационный компонент: только отображает данные товара.
export function ProductCard({ product }) {
  const fallback = placeholder(product.category);
  // fakestoreapi отдаёт ссылку на фото товара в поле image
  const [imgSrc, setImgSrc] = React.useState(product.image || fallback);

  return (
    <article
      style={{
        border: '1px solid #e0e0e0',
        padding: '1rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '200px',
          marginBottom: '1rem',
          borderRadius: '4px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={imgSrc}
          alt={product.title}
          loading="lazy"
          // если картинка не загрузилась — подменяем заглушкой
          onError={() => {
            if (imgSrc !== fallback) setImgSrc(fallback);
          }}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain', // фото целиком, без обрезки и растягивания
            width: imgSrc === fallback ? '100%' : 'auto',
          }}
        />
      </div>
      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{product.title}</h3>
      <p style={{ margin: '4px 0', color: '#555' }}>Категория: {product.category}</p>
      <p style={{ margin: 0, fontWeight: 'bold', fontSize: '1.2rem', marginTop: 'auto' }}>
        {product.price.toLocaleString('ru-RU')} ₽
      </p>
    </article>
  );
}
