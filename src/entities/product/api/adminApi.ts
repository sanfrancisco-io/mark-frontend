import { http } from '@/shared/api'
import type { ProductsResponse, ProductDetail, Offer, Seller } from '../model'

export interface ProductFormData {
  name: string
  price_amount: string
  price_currency: string
  stock: number
  description: string
  attributes?: { name: string; value: string }[]
}

export interface OfferFormData {
  seller_id: number
  price_amount: string
  price_currency: string
  delivery_date: string
}

export function getAdminProducts(offset: number, limit: number) {
  return http.get<ProductsResponse>('/v1/admin/products', { params: { offset, limit } }).then((r) => r.data)
}

export function getAdminProduct(id: number) {
  return http.get<ProductDetail>(`/v1/admin/products/${id}`).then((r) => r.data)
}

export function createProduct(data: ProductFormData) {
  return http.post<ProductDetail>('/v1/admin/products', data).then((r) => r.data)
}

export function updateProduct(id: number, data: Partial<ProductFormData>) {
  return http.put<ProductDetail>(`/v1/admin/products/${id}`, data).then((r) => r.data)
}

export function deleteProduct(id: number) {
  return http.delete(`/v1/admin/products/${id}`)
}

export function uploadProductImage(id: number, file: File) {
  const form = new FormData()
  form.append('file', file)
  return http.post(`/v1/admin/products/${id}/image`, form)
}

export function getProductOffers(productId: number) {
  return http.get<Offer[]>(`/v1/admin/products/${productId}/offers`).then((r) => r.data)
}

export function createOffer(productId: number, data: OfferFormData) {
  return http.post<Offer>(`/v1/admin/products/${productId}/offers`, data).then((r) => r.data)
}

export function updateOffer(offerId: number, data: Partial<OfferFormData>) {
  return http.put<Offer>(`/v1/admin/offers/${offerId}`, data).then((r) => r.data)
}

export function deleteOffer(offerId: number) {
  return http.delete(`/v1/admin/offers/${offerId}`)
}

export function getSellers() {
  return http.get<Seller[]>('/v1/admin/sellers').then((r) => r.data)
}
