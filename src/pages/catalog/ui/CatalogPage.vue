<template>
  <main class="catalog">
    <h1 class="catalog__title">Каталог товаров</h1>

    <div class="catalog__grid">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>

    <div class="catalog__footer">
      <AppSpinner v-if="loading" />
      <p v-else-if="!hasMore && products.length > 0" class="catalog__end">
        Все товары загружены
      </p>
    </div>

    <div ref="sentinel" />
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ProductCard } from '@/widgets/product-card'
import { AppSpinner } from '@/shared/ui'
import { useInfiniteScroll } from '@/features/infinite-scroll'
import { useCatalog } from '../model/useCatalog'

const { products, loading, hasMore, loadMore } = useCatalog()

const sentinel = ref<HTMLElement | null>(null)
useInfiniteScroll(sentinel, loadMore, loading)
</script>

<style scoped>
.catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
}
.catalog__title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 24px;
  color: #111827;
}
.catalog__grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}
@media (max-width: 1024px) {
  .catalog__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 768px) {
  .catalog__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
}
.catalog__footer {
  display: flex;
  justify-content: center;
  padding: 32px 0 16px;
  min-height: 64px;
}
.catalog__end {
  color: #9ca3af;
  font-size: 14px;
}
</style>
