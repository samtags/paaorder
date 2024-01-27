import {useEffect} from 'react';
import {IActions} from '@/services/bit';
import getOrders, {Order} from '@/services/api/getOrders';
import getCustomers, {Customer} from '@/services/api/getCustomers';
import {Orders, Customers} from '@/index';

interface Methods {
  //
}

const AppActions: IActions<Methods> = ({
  useRegisterActions,
  getState,
  setState,
}) => {
  function handleOrders(orders: Order[]) {
    const orderTable: Orders = {};

    orders.forEach(order => {
      orderTable[order.orderId] = order;
    });

    setState<Orders>('orders', orderTable);
  }

  function handleCustomers(customers: Customer[]) {
    const customerTable: Customers = {};

    customers.forEach(customer => {
      customerTable[customer.customerId] = customer;
    });

    setState<Customers>('customers', customerTable);
  }

  useEffect(() => {
    const orders = getState<Orders>('orders');
    const customers = getState<Customers>('customers');

    if (Object.keys(orders).length === 0) {
      getOrders().then(handleOrders);
    }

    if (Object.keys(customers).length === 0) {
      getCustomers().then(handleCustomers);
    }
  }, []);

  // public methods
  return useRegisterActions({});
};

export default AppActions;
