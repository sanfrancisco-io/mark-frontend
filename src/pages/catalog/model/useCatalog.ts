import { ref } from 'vue'
import { getProducts } from '@/entities/product'
import type { Product } from '@/entities/product'

const LIMIT = 20

export function useCatalog() {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const hasMore = ref(true)
  const offset = ref(0)

  async function loadMore() {
    if (loading.value || !hasMore.value) return
    loading.value = true
    try {
      const data = await getProducts(offset.value, LIMIT)
      products.value.push(...data.items)
      hasMore.value = data.has_more
      offset.value += data.items.length
    } finally {
      loading.value = false
    }
  }

  return { products, loading, hasMore, loadMore }
}
