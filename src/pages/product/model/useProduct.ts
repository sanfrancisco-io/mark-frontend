import { ref, onMounted } from 'vue'
import { getProduct } from '@/entities/product'
import type { ProductDetail } from '@/entities/product'

export function useProduct(id: number) {
  const product = ref<ProductDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  onMounted(async () => {
    loading.value = true
    try {
      product.value = await getProduct(id)
    } catch {
      error.value = 'Не удалось загрузить товар'
    } finally {
      loading.value = false
    }
  })

  return { product, loading, error }
}
