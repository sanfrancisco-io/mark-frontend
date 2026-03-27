<template>
  <div class="overlay" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">{{ isEdit ? 'Редактировать товар' : 'Новый товар' }}</h2>
        <button class="modal__close" @click="$emit('close')">✕</button>
      </div>

      <AppSpinner v-if="loadingProduct" class="modal__spinner" />

      <form v-else @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="field field--full">
            <label class="field__label">Название *</label>
            <input v-model="form.name" class="field__input" required />
          </div>
          <div class="field">
            <label class="field__label">Цена *</label>
            <input v-model="form.price_amount" class="field__input" type="number" step="0.01" min="0" required />
          </div>
          <div class="field">
            <label class="field__label">Валюта</label>
            <input v-model="form.price_currency" class="field__input" maxlength="3" />
          </div>
          <div class="field">
            <label class="field__label">Остаток *</label>
            <input v-model.number="form.stock" class="field__input" type="number" min="0" required />
          </div>
          <div class="field field--full">
            <label class="field__label">Описание</label>
            <textarea v-model="form.description" class="field__input field__textarea" rows="3" />
          </div>
        </div>

        <div class="section">
          <div class="section__header">
            <span class="section__title">Атрибуты</span>
            <AppButton type="button" variant="secondary" @click="addAttr">+ Добавить</AppButton>
          </div>
          <div v-for="(attr, i) in form.attributes" :key="i" class="attr-row">
            <input v-model="attr.name" class="field__input" placeholder="Название" />
            <input v-model="attr.value" class="field__input" placeholder="Значение" />
            <button type="button" class="attr-row__remove" @click="removeAttr(i)">✕</button>
          </div>
        </div>

        <div class="section">
          <div class="section__header">
            <span class="section__title">Изображение</span>
          </div>
          <img v-if="currentImageUrl" :src="currentImageUrl" class="image-preview" alt="Текущее фото" />
          <input type="file" accept="image/*" class="field__input" @change="onFileChange" />
        </div>

        <p v-if="submitError" class="form-error">{{ submitError }}</p>

        <div class="modal__footer">
          <AppButton type="button" variant="secondary" @click="$emit('close')">Отмена</AppButton>
          <AppButton type="submit" variant="primary" :disabled="submitting">
            {{ submitting ? 'Сохранение...' : 'Сохранить' }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { AppButton, AppSpinner } from '@/shared/ui'
import { getAdminProduct, createProduct, updateProduct, uploadProductImage } from '@/entities/product'

const props = defineProps<{ productId: number | null }>()
const emit = defineEmits<{ close: []; saved: [] }>()

const isEdit = computed(() => props.productId !== null)

const form = ref({
  name: '',
  price_amount: '',
  price_currency: 'RUB',
  stock: 0,
  description: '',
  attributes: [] as { name: string; value: string }[],
})
const imageFile = ref<File | null>(null)
const currentImageUrl = ref<string | null>(null)
const loadingProduct = ref(false)
const submitting = ref(false)
const submitError = ref<string | null>(null)

onMounted(async () => {
  if (props.productId === null) return
  loadingProduct.value = true
  try {
    const p = await getAdminProduct(props.productId)
    form.value = {
      name: p.name,
      price_amount: p.price_amount,
      price_currency: p.price_currency,
      stock: p.stock,
      description: p.description,
      attributes: (p.attributes ?? []).map((a) => ({ ...a })),
    }
    currentImageUrl.value = p.image_url ?? p.thumbnail_url
  } finally {
    loadingProduct.value = false
  }
})

function addAttr() {
  form.value.attributes.push({ name: '', value: '' })
}

function removeAttr(i: number) {
  form.value.attributes.splice(i, 1)
}

function onFileChange(e: Event) {
  imageFile.value = (e.target as HTMLInputElement).files?.[0] ?? null
}

async function handleSubmit() {
  submitting.value = true
  submitError.value = null
  try {
    let id = props.productId
    if (id === null) {
      const created = await createProduct({
        name: form.value.name,
        price_amount: form.value.price_amount,
        price_currency: form.value.price_currency,
        stock: form.value.stock,
        description: form.value.description,
        attributes: form.value.attributes,
      })
      id = created.id
    } else {
      await updateProduct(id, {
        name: form.value.name,
        price_amount: form.value.price_amount,
        price_currency: form.value.price_currency,
        stock: form.value.stock,
        description: form.value.description,
        attributes: form.value.attributes,
      })
    }
    if (imageFile.value) {
      await uploadProductImage(id, imageFile.value)
    }
    emit('saved')
  } catch {
    submitError.value = 'Ошибка при сохранении. Попробуйте ещё раз.'
  } finally {
    submitting.value = false
  }
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
  max-width: 580px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 28px;
}
.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}
.modal__title {
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  color: #111827;
}
.modal__close {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  padding: 4px;
}
.modal__close:hover { color: #111827; }
.modal__spinner { display: block; margin: 40px auto; }
.modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-bottom: 24px;
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
  transition: border-color 0.15s;
  font-family: inherit;
}
.field__input:focus { border-color: #3b82f6; }
.field__textarea { resize: vertical; }
.section { margin-bottom: 20px; }
.section__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.section__title { font-size: 14px; font-weight: 600; color: #374151; }
.attr-row {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 8px;
  margin-bottom: 6px;
  align-items: center;
}
.attr-row__remove {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  line-height: 1;
}
.image-preview {
  display: block;
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
  border: 1px solid #e5e7eb;
}
.form-error {
  color: #ef4444;
  font-size: 13px;
  margin: 0 0 12px;
}
</style>
