<template>
  <main class="product-page">
    <button class="product-page__back" @click="$router.back()">← Назад</button>

    <AppSpinner v-if="loading" class="product-page__spinner" />

    <p v-else-if="error" class="product-page__error">{{ error }}</p>

    <template v-else-if="product">
      <div class="product-page__layout">
        <div class="product-page__image-wrap">
          <img v-if="product.image_url" class="product-page__image" :src="product.image_url" :alt="product.name" />
        </div>

        <div class="product-page__info">
          <h1 class="product-page__name">{{ product.name }}</h1>
          <p class="product-page__price">{{ formattedPrice }}</p>
          <p class="product-page__stock">В наличии: {{ product.stock }} шт.</p>
          <p v-if="product.description" class="product-page__description">{{ product.description }}</p>

          <table v-if="product.attributes.length" class="product-page__attrs">
            <tbody>
              <tr v-for="attr in product.attributes" :key="attr.name">
                <td class="product-page__attr-name">{{ attr.name }}</td>
                <td class="product-page__attr-value">{{ attr.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="product-page__offers">
        <OffersTable :offers="product.offers" />
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { AppSpinner } from '@/shared/ui'
import { OffersTable } from '@/widgets/offers-list'
import { useProduct } from '../model/useProduct'

const route = useRoute()
const id = Number(route.params.id)

const { product, loading, error } = useProduct(id)

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: product.value.price_currency,
    maximumFractionDigits: 0,
  }).format(Number(product.value.price_amount))
})
</script>

<style scoped>
.product-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;
}
.product-page__back {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.product-page__back:hover { text-decoration: underline; }
.product-page__spinner {
  display: block;
  margin: 80px auto;
}
.product-page__error {
  color: #ef4444;
  text-align: center;
  margin-top: 80px;
}
.product-page__layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 40px;
  align-items: start;
}
@media (max-width: 768px) {
  .product-page__layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .product-page__name { font-size: 18px; }
  .product-page__price { font-size: 22px; }
}
.product-page__image-wrap {
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
  aspect-ratio: 1;
}
.product-page__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.product-page__name {
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 12px;
  color: #111827;
}
.product-page__price {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px;
}
.product-page__stock {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px;
}
.product-page__description {
  font-size: 14px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 20px;
}
.product-page__attrs {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.product-page__attr-name,
.product-page__attr-value {
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
  vertical-align: top;
}
.product-page__attr-name {
  color: #6b7280;
  width: 45%;
  padding-right: 16px;
}
.product-page__attr-value {
  color: #111827;
  font-weight: 500;
}
.product-page__offers {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid #e5e7eb;
}
</style>
