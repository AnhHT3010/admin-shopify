export interface Product {
  id: number;
  image: string;
  title: string;
  rules: string;
  lastUpdate: string;
  status: string;
}

export interface IResponseDataPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface FormCreateProduct {
  title: string;
  price: string;
  imageFile: File | null;
  description: string;
}
