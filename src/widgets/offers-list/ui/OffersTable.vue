<template>
  <div class="offers">
    <div class="offers__header">
      <h2 class="offers__title">Предложения продавцов</h2>
      <div class="offers__sort">
        <AppButton :variant="sortBy === 'price' ? 'primary' : 'secondary'" @click="sortBy = 'price'">
          По цене
        </AppButton>
        <AppButton :variant="sortBy === 'date' ? 'primary' : 'secondary'" @click="sortBy = 'date'">
          По дате доставки
        </AppButton>
      </div>
    </div>

    <table class="offers__table">
      <thead>
        <tr>
          <th>Продавец</th>
          <th>Рейтинг</th>
          <th>Цена</th>
          <th>Дата доставки</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="offer in sorted" :key="offer.id">
          <td>{{ offer.seller.name }}</td>
          <td>
            <AppBadge :variant="ratingVariant(offer.seller.rating)">
              ★ {{ offer.seller.rating }}
            </AppBadge>
          </td>
          <td class="offers__price">{{ formatPrice(offer.price_amount, offer.price_currency) }}</td>
          <td>{{ formatDate(offer.delivery_date) }}</td>
        </tr>
      </tbody>
    </table>

    <p v-if="offers.length === 0" class="offers__empty">Нет предложений</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Offer } from '@/entities/product'
import { AppButton, AppBadge } from '@/shared/ui'

const props = defineProps<{ offers: Offer[] }>()

const sortBy = ref<'price' | 'date'>('price')

const sorted = computed(() => {
  return [...props.offers].sort((a, b) => {
    if (sortBy.value === 'price') {
      return Number(a.price_amount) - Number(b.price_amount)
    }
    return a.delivery_date.localeCompare(b.delivery_date)
  })
})

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
}

function ratingVariant(rating: string): 'success' | 'warning' | 'default' {
  const r = Number(rating)
  if (r >= 4.5) return 'success'
  if (r >= 3.5) return 'warning'
  return 'default'
}
</script>

<style scoped>
.offers__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}
.offers__title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
}
.offers__sort {
  display: flex;
  gap: 8px;
}
.offers {
  overflow-x: auto;
}
.offers__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 480px;
}
.offers__table th {
  text-align: left;
  padding: 8px 12px;
  border-bottom: 2px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
}
.offers__table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
}
.offers__table tr:last-child td {
  border-bottom: none;
}
.offers__price {
  font-weight: 600;
}
.offers__empty {
  color: #9ca3af;
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}
</style>
