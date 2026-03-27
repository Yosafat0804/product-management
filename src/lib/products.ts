import { apiClient } from "./api";

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  thumbnail: string;
  images: string[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreateProductData {
  title: string;
  description: string;
  price: number;
  category?: string;
  brand?: string;
  stock?: number;
  thumbnail?: string;
}

export async function getProducts(
  limit: number = 10,
  skip: number = 0
): Promise<ProductsResponse> {
  return apiClient<ProductsResponse>(
    `/products?limit=${limit}&skip=${skip}`
  );
}

export async function searchProducts(
  query: string,
  limit: number = 10,
  skip: number = 0
): Promise<ProductsResponse> {
  return apiClient<ProductsResponse>(
    `/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`
  );
}

export async function getProduct(id: number): Promise<Product> {
  return apiClient<Product>(`/products/${id}`);
}

export async function createProduct(
  data: CreateProductData
): Promise<Product> {
  return apiClient<Product>("/products/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: number,
  data: Partial<CreateProductData>
): Promise<Product> {
  return apiClient<Product>(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export interface DeletedProduct extends Product {
  isDeleted: boolean;
  deletedOn: string;
}

export async function deleteProduct(id: number): Promise<DeletedProduct> {
  return apiClient<DeletedProduct>(`/products/${id}`, {
    method: "DELETE",
  });
}

export async function getCategories(): Promise<string[]> {
  return apiClient<string[]>("/products/category-list");
}
