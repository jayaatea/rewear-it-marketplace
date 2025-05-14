
export interface CartItem {
  id: string;
  product_id: string;
  rental_start_date: string | null;
  rental_end_date: string | null;
  products: {
    id: string;
    title: string;
    price: number;
    deposit: number;
    image_url: string | null;
    size: string | null;
    condition: string | null;
  };
}

export interface RawCartItem {
  id: string;
  product_id: string;
  rental_start_date: string | null;
  rental_end_date: string | null;
  products: any;
}
