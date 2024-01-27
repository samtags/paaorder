import {Customer} from '@/services/api/getCustomers';
import {Order} from '@/services/api/getOrders';

export default {
  customers: {} as Customers,
  orders: {} as Orders,
  completedOrders: {} as Orders,
};

// append below the keys in the state that want to be persisted
export const whitelistedStateKeys = [
  'customers',
  'orders', //
  'completedOrders',
];

export interface Customers {
  [key: number]: Customer;
}

export interface Orders {
  [key: number]: Order;
}
