<template>
  <article class="product-card" @click="$router.push(`/product/${product.id}`)">
    <div class="product-card__image-wrap">
      <img
        class="product-card__image"
        :src="product.thumbnail_url"
        :alt="product.name"
        loading="lazy"
      />
    </div>
    <div class="product-card__body">
      <p class="product-card__name">{{ product.name }}</p>
      <p class="product-card__price">{{ formattedPrice }}</p>
      <p class="product-card__meta">В наличии: {{ product.stock }} шт.</p>
      <p class="product-card__meta">Доставка: {{ formattedDate }}</p>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Product } from '@/entities/product'

const props = defineProps<{ product: Product }>()

const formattedPrice = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: props.product.price_currency,
  maximumFractionDigits: 0,
}).format(Number(props.product.price_amount))

const formattedDate = new Date(props.product.nearest_delivery_date).toLocaleDateString('ru-RU', {
  day: 'numeric',
  month: 'short',
})
</script>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow 0.2s, transform 0.2s;
  background: #fff;
}
.product-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}
.product-card__image-wrap {
  aspect-ratio: 1;
  overflow: hidden;
  background: #f9fafb;
}
.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-card__body {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.product-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.product-card__price {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 4px 0 0;
}
.product-card__meta {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}
</style>
