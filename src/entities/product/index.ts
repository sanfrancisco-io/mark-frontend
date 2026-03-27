export type { Product, ProductDetail, ProductAttribute, ProductsResponse, Offer, Seller } from './model'
export {
  getProducts,
  getProduct,
  getAdminProducts,
  getAdminProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
  getProductOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  getSellers,
} from './api'
export type { ProductFormData, OfferFormData } from './api'
