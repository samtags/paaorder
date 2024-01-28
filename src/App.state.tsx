import {Customer} from '@/services/api/getCustomers';
import {Order} from '@/services/api/getOrders';

export default {
  customers: {} as Customers,
  orders: {} as Orders,
  completedOrders: {} as Orders,
  expiredOrders: {} as Orders,
  expireDurationInSec: 60,
};

// append below the keys in the state that want to be persisted
export const whitelistedStateKeys = [
  'customers',
  'orders', //
  'completedOrders',
  'expiredOrders',
];

export interface Customers {
  [key: number]: Customer;
}

export interface Orders {
  [key: number]: Order;
}
