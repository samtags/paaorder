import {Customer} from '@/services/api/getCustomers';
import {Order} from '@/services/api/getOrders';

export default {
  customers: {} as Customers,
  orders: {} as Orders,
};

export interface Customers {
  [key: number]: Customer;
}

export interface Orders {
  [key: number]: Order;
}
