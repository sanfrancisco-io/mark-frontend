<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">Офферы товара</h2>
        <button class="modal__close" @click="$emit('close')">✕</button>
      </div>

      <AppSpinner v-if="loading" class="modal__spinner" />

      <template v-else>
        <table v-if="offers.length" class="offers-table">
          <thead>
            <tr>
              <th>Продавец</th>
              <th>Цена</th>
              <th>Дата доставки</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="offer in offers" :key="offer.id">
              <td>{{ offer.seller.name }}</td>
              <td>{{ offer.price_amount }} {{ offer.price_currency }}</td>
              <td>{{ offer.delivery_date }}</td>
              <td class="offers-table__actions">
                <AppButton variant="secondary" @click="startEdit(offer)">✎</AppButton>
                <AppButton variant="danger" @click="handleDeleteOffer(offer.id)">✕</AppButton>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">Офферов пока нет</p>

        <div class="offer-form">
          <h3 class="offer-form__title">
            {{ editingOfferId !== null ? 'Редактировать оффер' : 'Добавить оффер' }}
          </h3>
          <form @submit.prevent="handleSubmitOffer">
            <div class="form-grid">
              <div class="field field--full">
                <label class="field__label">Продавец *</label>
                <select v-model="offerForm.seller_id" class="field__input" required>
                  <option :value="0" disabled>Выберите продавца</option>
                  <option v-for="seller in sellers" :key="seller.id" :value="seller.id">
                    {{ seller.name }} (★{{ seller.rating }})
                  </option>
                </select>
              </div>
              <div class="field">
                <label class="field__label">Цена *</label>
                <input v-model="offerForm.price_amount" class="field__input" type="number" step="0.01" min="0" required />
              </div>
              <div class="field">
                <label class="field__label">Валюта</label>
                <input v-model="offerForm.price_currency" class="field__input" maxlength="3" />
              </div>
              <div class="field field--full">
                <label class="field__label">Дата доставки *</label>
                <input v-model="offerForm.delivery_date" class="field__input" type="date" required />
              </div>
            </div>

            <p v-if="offerError" class="form-error">{{ offerError }}</p>

            <div class="offer-form__actions">
              <AppButton v-if="editingOfferId !== null" type="button" variant="secondary" @click="cancelEdit">
                Отмена
              </AppButton>
              <AppButton type="submit" variant="primary" :disabled="offerSubmitting">
                {{ offerSubmitting ? 'Сохранение...' : editingOfferId !== null ? 'Обновить' : 'Добавить' }}
              </AppButton>
            </div>
          </form>
        </div>
      </template>

      <div class="modal__footer">
        <AppButton variant="secondary" @click="$emit('close')">Закрыть</AppButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AppButton, AppSpinner } from '@/shared/ui'
import { getProductOffers, createOffer, updateOffer, deleteOffer, getSellers } from '@/entities/product'
import type { Offer, Seller } from '@/entities/product'

const props = defineProps<{ productId: number }>()
defineEmits<{ close: [] }>()

const offers = ref<Offer[]>([])
const sellers = ref<Seller[]>([])
const loading = ref(false)

const editingOfferId = ref<number | null>(null)
const offerSubmitting = ref(false)
const offerError = ref<string | null>(null)

const offerForm = ref({
  seller_id: 0,
  price_amount: '',
  price_currency: 'RUB',
  delivery_date: '',
})

onMounted(async () => {
  loading.value = true
  try {
    ;[offers.value, sellers.value] = await Promise.all([
      getProductOffers(props.productId),
      getSellers(),
    ])
  } finally {
    loading.value = false
  }
})

function startEdit(offer: Offer) {
  editingOfferId.value = offer.id
  offerForm.value = {
    seller_id: offer.seller.id,
    price_amount: offer.price_amount,
    price_currency: offer.price_currency,
    delivery_date: offer.delivery_date,
  }
}

function cancelEdit() {
  editingOfferId.value = null
  resetForm()
}

function resetForm() {
  offerForm.value = { seller_id: 0, price_amount: '', price_currency: 'RUB', delivery_date: '' }
  offerError.value = null
}

async function handleSubmitOffer() {
  if (offerForm.value.seller_id === 0) {
    offerError.value = 'Выберите продавца'
    return
  }
  offerSubmitting.value = true
  offerError.value = null
  try {
    const data = {
      seller_id: offerForm.value.seller_id,
      price_amount: offerForm.value.price_amount,
      price_currency: offerForm.value.price_currency,
      delivery_date: offerForm.value.delivery_date,
    }
    if (editingOfferId.value !== null) {
      const updated = await updateOffer(editingOfferId.value, data)
      const idx = offers.value.findIndex((o) => o.id === editingOfferId.value)
      if (idx !== -1) offers.value[idx] = updated
      editingOfferId.value = null
    } else {
      const created = await createOffer(props.productId, data)
      offers.value.push(created)
    }
    resetForm()
  } catch {
    offerError.value = 'Ошибка при сохранении'
  } finally {
    offerSubmitting.value = false
  }
}

async function handleDeleteOffer(id: number) {
  if (!confirm('Удалить этот оффер?')) return
  await deleteOffer(id)
  offers.value = offers.value.filter((o) => o.id !== id)
}
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal {
  background: #fff;
  border-radius: 12px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
}
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.modal__title { font-size: 18px; font-weight: 700; margin: 0; color: #111827; }
.modal__close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  padding: 4px;
  line-height: 1;
}
.modal__close:hover { color: #111827; }
.modal__spinner { display: block; margin: 40px auto; }
.modal__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid #f3f4f6;
}
.offers-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  margin-bottom: 24px;
}
.offers-table th {
  text-align: left;
  padding: 8px 10px;
  border-bottom: 2px solid #e5e7eb;
  color: #6b7280;
  font-weight: 500;
}
.offers-table td {
  padding: 10px;
  border-bottom: 1px solid #f3f4f6;
  color: #111827;
  vertical-align: middle;
}
.offers-table tr:last-child td { border-bottom: none; }
.offers-table__actions { display: flex; gap: 4px; }
.empty { color: #9ca3af; font-size: 14px; margin-bottom: 20px; }
.offer-form {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  margin-top: 4px;
}
.offer-form__title { font-size: 15px; font-weight: 600; margin: 0 0 14px; color: #374151; }
.offer-form__actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 12px; }
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.field { display: flex; flex-direction: column; gap: 5px; }
.field--full { grid-column: 1 / -1; }
.field__label { font-size: 13px; font-weight: 500; color: #374151; }
.field__input {
  padding: 8px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #fff;
  outline: none;
  font-family: inherit;
  transition: border-color 0.15s;
}
.field__input:focus { border-color: #3b82f6; }
.form-error { color: #ef4444; font-size: 13px; margin: 0 0 8px; }
</style>
