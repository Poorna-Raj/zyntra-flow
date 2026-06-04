export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  province: string;
  demandLevel: "High" | "Medium" | "Low";
  createdAt: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  price: number;
  stock: number;
  image: string;
  province: string;
  demandLevel: "High" | "Medium" | "Low";
}