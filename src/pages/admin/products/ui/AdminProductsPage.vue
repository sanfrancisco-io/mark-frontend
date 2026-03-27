<template>
  <div class="admin">
    <header class="admin__header">
      <h1 class="admin__title">Управление товарами</h1>
      <div class="admin__header-actions">
        <AppButton variant="primary" @click="openCreate">+ Добавить товар</AppButton>
        <AppButton variant="secondary" @click="logout">Выйти</AppButton>
      </div>
    </header>

    <div class="admin__search">
      <input
        v-model="searchQuery"
        class="admin__search-input"
        type="search"
        placeholder="Поиск по названию..."
      />
      <span v-if="searchQuery" class="admin__search-count">
        Найдено: {{ filteredProducts.length }}
      </span>
    </div>

    <div v-if="loading && products.length === 0" class="admin__center"><AppSpinner /></div>
    <p v-else-if="error" class="admin__error">{{ error }}</p>

    <template v-else>
      <p v-if="filteredProducts.length === 0" class="admin__empty">
        {{ searchQuery ? 'Ничего не найдено' : 'Товаров пока нет' }}
      </p>
      <table v-else class="admin__table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Цена</th>
            <th>Остаток</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td class="admin__td-id">{{ product.id }}</td>
            <td>{{ product.name }}</td>
            <td>{{ formatPrice(product.price_amount, product.price_currency) }}</td>
            <td>{{ product.stock }}</td>
            <td class="admin__td-actions">
              <AppButton variant="secondary" @click="openEdit(product.id)">Редактировать</AppButton>
              <AppButton variant="secondary" @click="openOffers(product.id)">Офферы</AppButton>
              <AppButton variant="danger" @click="handleDelete(product.id, product.name)">Удалить</AppButton>
            </td>
          </tr>
        </tbody>
      </table>
    </template>

    <div class="admin__footer">
      <AppSpinner v-if="loading && products.length > 0" />
      <p v-else-if="!hasMore && products.length > 0" class="admin__end">Все товары загружены</p>
    </div>
    <div ref="sentinel" />

    <ProductFormModal
      v-if="showProductForm"
      :product-id="editingProductId"
      @close="showProductForm = false"
      @saved="onProductSaved"
    />

    <OfferFormModal
      v-if="showOfferModal && offersProductId !== null"
      :product-id="offersProductId"
      @close="showOfferModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AppButton, AppSpinner } from '@/shared/ui'
import { useAuth } from '@/features/auth'
import { useInfiniteScroll } from '@/features/infinite-scroll'
import { getAdminProducts, deleteProduct } from '@/entities/product'
import type { Product } from '@/entities/product'
import ProductFormModal from './ProductFormModal.vue'
import OfferFormModal from './OfferFormModal.vue'

const LIMIT = 20

const { logout } = useAuth()

const products = ref<Product[]>([])
const loading = ref(false)
const hasMore = ref(true)
const offset = ref(0)
const error = ref<string | null>(null)

const searchQuery = ref('')

const filteredProducts = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return products.value
  return products.value.filter((p) => p.name.toLowerCase().includes(q))
})

const showProductForm = ref(false)
const editingProductId = ref<number | null>(null)
const showOfferModal = ref(false)
const offersProductId = ref<number | null>(null)

async function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  error.value = null
  try {
    const data = await getAdminProducts(offset.value, LIMIT)
    products.value.push(...data.items)
    hasMore.value = data.has_more
    offset.value += data.items.length
  } catch {
    error.value = 'Не удалось загрузить товары'
  } finally {
    loading.value = false
  }
}

async function resetAndReload() {
  products.value = []
  offset.value = 0
  hasMore.value = true
  await loadMore()
}

const sentinel = ref<HTMLElement | null>(null)
useInfiniteScroll(sentinel, loadMore, loading)

function openCreate() {
  editingProductId.value = null
  showProductForm.value = true
}

function openEdit(id: number) {
  editingProductId.value = id
  showProductForm.value = true
}

function openOffers(id: number) {
  offersProductId.value = id
  showOfferModal.value = true
}

async function handleDelete(id: number, name: string) {
  if (!confirm(`Удалить товар "${name}"?`)) return
  await deleteProduct(id)
  products.value = products.value.filter((p) => p.id !== id)
}

function onProductSaved() {
  showProductForm.value = false
  resetAndReload()
}

function formatPrice(amount: string, currency: string) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount))
}
</script>

<style scoped>
.admin {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 16px;
}
.admin__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}
.admin__title {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}
.admin__header-actions {
  display: flex;
  gap: 8px;
}
.admin__search {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}
.admin__search-input {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  width: 280px;
  transition: border-color 0.15s;
}
.admin__search-input:focus { border-color: #3b82f6; }
.admin__search-count {
  font-size: 13px;
  color: #6b7280;
}
.admin__center {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}
.admin__error,
.admin__empty {
  text-align: center;
  color: #6b7280;
  padding: 40px 0;
}
.admin__error { color: #ef4444; }
.admin__table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}
.admin__table th {
  text-align: left;
  padding: 10px 12px;
  border-bottom: 2px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
  white-space: nowrap;
}
.admin__table td {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
  vertical-align: middle;
}
.admin__table tr:last-child td { border-bottom: none; }
.admin__td-id { color: #9ca3af; width: 48px; }
.admin__td-actions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.admin__footer {
  display: flex;
  justify-content: center;
  padding: 24px 0 8px;
  min-height: 48px;
}
.admin__end {
  color: #9ca3af;
  font-size: 14px;
}
</style>
