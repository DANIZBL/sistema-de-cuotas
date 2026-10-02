export enum Currency {
  ARS = "pesos",
  US = "dolares"
}

export enum DeliveryMethod {
  LOCAL = "local",
  ENVIO = "envio"
}

export enum InstallmentStatus {
  PENDIENTE = "pendiente",
  PARCIAL = "parcial",
  PAGADA = "pagada"
}

export enum OrderStatus {
  PENDIENTE = "pendiente",
  EN_CURSO = "en curso",
  PAGADO = "pagado"
}

export enum PaymentMethod {
  EFECTIVO = "efectivo",
  TRANSFERENCIA = "transferencia"
}

export interface OrderImage {
  productId: string;
  product: string;
  skuId: string;
  sku: unknown;
  url: string;
  position: number;
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface OrderProduct {
  id: string;
  name: string;
  description: string;
  type: "simple" | "variable" | "bundle";
  isPublished: boolean;
  images: OrderImage[];
}

export interface OrderVariantValue {
  skuId: string;
  sku: string;
  variantId: string;
  variant: {
    name: string;
    value: string;
  };
  id: string;
}

export interface OrderSKU {
  productId: string;
  product: OrderProduct;
  code: string;
  price: number;
  discountedPrice: number | null;
  stock: number;
  variantValues: OrderVariantValue[];
  images: OrderImage[];
  components: unknown[];
  partOf: unknown[];
  id: string;
}

export interface OrderItem {
  id: string;
  quantity: number;
  unit_price: number;
  discounted_price: number | null;
  sku: OrderSKU;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Installment {
  id: string;
  order_id: string;
  installment_number: number;
  base_amount: number;
  previous_balance: number | null;
  amount_due: number;
  amount_received: number | null;
  currency_received: Currency | null;
  payment_method: PaymentMethod | null;
  exchange_rate: number | null;
  converted_amount: number | null;
  status: InstallmentStatus;
  email_notification_sent: boolean;
  whatsapp_notification_sent: boolean;
  period: string;
  paid_at: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  client_name: string;
  client_surname: string;
  status: OrderStatus
  mail: string | null;

  phone: string;

  total_amount: number;

  currency: Currency;

  delivered_method: DeliveryMethod;

  items: OrderItem[];

  installments: Installment[];

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
