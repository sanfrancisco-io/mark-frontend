import { http } from '@/shared/api'
import type { ProductsResponse, ProductDetail } from '../model'

export function getProducts(offset: number, limit: number): Promise<ProductsResponse> {
  return http.get<ProductsResponse>('/v1/public/products', { params: { offset, limit } }).then((r) => r.data)
}

export function getProduct(id: number): Promise<ProductDetail> {
  return http.get<ProductDetail>(`/v1/public/products/${id}`).then((r) => r.data)
}
