export type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
  desciption?: string;
  discount?: string;
};

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export type ProductAction = 
  | { type: 'FETCH_SUCCESS'; payload: Product[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string };