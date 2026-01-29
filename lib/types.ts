export interface User {
  id: number
  name: string
  email: string
  phone?: string
  role: 'user' | 'admin'
  created_at: string
}

export interface PhoneBrand {
  id: number
  name: string
  logo_url?: string
}

export interface PhoneModel {
  id: number
  brand_id: number
  brand_name?: string
  name: string
  image_url?: string
}

export interface DisplayPrice {
  id: number
  model_id: number
  model_name?: string
  brand_name?: string
  price: number
  quality: string
  in_stock: boolean
}

export interface AccessoryCategory {
  id: number
  name: string
  icon?: string
}

export interface Accessory {
  id: number
  category_id: number
  category_name?: string
  name: string
  description?: string
  price: number
  quantity: number
  image_url?: string
}

export interface SimProvider {
  id: number
  name: string
  logo_url?: string
}

export interface SimCard {
  id: number
  provider_id: number
  provider_name?: string
  provider_logo?: string
  type: string
  price: number
  quantity: number
}

export interface RouterProvider {
  id: number
  name: string
  logo_url?: string
}

export interface Router {
  id: number
  provider_id: number
  provider_name?: string
  name: string
  description?: string
  price: number
  quantity: number
  image_url?: string
}

export interface Service {
  id: number
  name: string
  description?: string
  price?: number
  icon?: string
}

export interface Review {
  id: number
  user_id: number
  user_name?: string
  rating: number
  comment?: string
  is_approved: boolean
  created_at: string
}
