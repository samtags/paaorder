interface Item {
  itemId: number;
  itemName: string;
  quantity: number;
  price: number;
}

export interface Order {
  customerId: number;
  items: Item[];
  orderId: number;
  status: 'open' | 'taken' | 'served' | 'expired';
  totalPrice: number;
  taxFree: boolean;
  timestamp: string;
  expirationDate?: Date;
}

export default async function getOrders() {
  const response = await fetch(
    'https://run.mocky.io/v3/59b36c84-192f-4aa9-bdc5-968277c1d057',
  );

  const orders = (await response.json()) as Order[];
  return orders;
}
