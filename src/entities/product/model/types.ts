export interface Product {
  id: number
  name: string
  price_amount: string
  price_currency: string
  stock: number
  thumbnail_url: string | null
  nearest_delivery_date: string
}

export interface ProductAttribute {
  name: string
  value: string
}

export interface Seller {
  id: number
  name: string
  rating: string
}

export interface Offer {
  id: number
  price_amount: string
  price_currency: string
  delivery_date: string
  seller: Seller
}

export interface ProductDetail extends Product {
  description: string
  image_url: string | null
  attributes: ProductAttribute[]
  offers: Offer[]
}

export interface ProductsResponse {
  items: Product[]
  has_more: boolean
}
