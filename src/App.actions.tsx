import {useEffect} from 'react';
import {IActions} from '@/services/bit';
import getOrders, {Order} from '@/services/api/getOrders';
import getCustomers, {Customer} from '@/services/api/getCustomers';
import {Orders, Customers} from '@/index';
import moment from 'moment';

export interface Methods {
  handleCompleteOrder: (orderId: number) => unknown;
  handleTakeOrder: (orderId: number) => unknown;
  handleExpiredOrder: (orderId: number) => unknown;
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
    const completedOrders = getState<Orders>('completedOrders');
    const customers = getState<Customers>('customers');

    if (Object.keys(completedOrders).length === 0) {
      if (Object.keys(orders).length === 0) {
        getOrders().then(handleOrders);
      }
    }

    if (Object.keys(customers).length === 0) {
      getCustomers().then(handleCustomers);
    }
  }, []);

  function handleCompleteOrder(orderId: number) {
    const order = getState<Order>(`orders.${orderId}`);
    const completedOrder = {...order};
    completedOrder.status = 'served';

    // remove order from the table
    const orders = getState<Orders>('orders');
    const mutableOrders = {...orders};
    delete mutableOrders[orderId];
    setState('orders', mutableOrders);

    // append to the completed order table
    const completedOrders = getState<Orders>('completedOrders');
    setState('completedOrders', {
      ...completedOrders,
      [orderId]: completedOrder,
    });
  }

  function handleTakeOrder(orderId: number) {
    const order = getState<Order>(`orders.${orderId}`);
    const mutableOrder = {...order};
    mutableOrder.status = 'taken';

    const now = moment();

    // expiration 30 sec
    now.add('seconds', 30);

    mutableOrder.expirationDate = now.toDate();

    const orders = getState<Orders>('orders');

    setState('orders', {
      ...orders,
      [orderId]: mutableOrder,
    });
  }

  function handleExpiredOrder(orderId: number) {
    // todo: update booking status to expired
    // todo: remove to the order table
    // todo: move to expired table
    console.log('🚀 ~ handleExpiredOrder ~ orderId:', orderId);
  }

  // public methods
  return useRegisterActions({
    handleCompleteOrder,
    handleTakeOrder,
    handleExpiredOrder,
  });
};

export default AppActions;
