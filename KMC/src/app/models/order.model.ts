interface RefundItem {
  reason: string;
  refunded_quantity: number;
  requested_quantity: number;
}
interface item {
  id: any;
  order: any;
  product_title_en: any;
  product_title_ar: any;
  product_image: any;
  quantity: any;
  price: any;
  total_price: any;
  status: any;
  refund_item: RefundItem;
}

export interface OrderResults {
  id: any;
  address: any;
  items: item[];
  code: any;
  price_paid: any;
  points_paid: any;
  points_value: any;
  total_price: any;
  created_at: string;
  order_status: string;
  payment_type: string;
  transaction_id: any;
  registered_order_id: any;
  delivery_date: any;
  tax_value: any;
  user: any;
  coupon: any;
  refundable: boolean;
  expires_after: number;
  can_be_paid: boolean;
  shipping_status: string;
  completed_at: any;
  order_weight: number;
  shipping_fees: number;
  number_of_boxes: number;
  awb: string;
}

export interface OrderInterface {
  count: any;
  next: any;
  results: OrderResults[];
}
