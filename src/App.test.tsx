import {createContext} from 'react';
import createComponent, {useActions} from '@/services/bit';
import AppState, {Orders} from '@/App.state';
import {fireEvent, render, screen} from '@testing-library/react-native';
import AppActions, {Methods} from '@/App.actions';
import {Text, TouchableOpacity} from 'react-native';
import ordersTable from './__test__/ordersTable';
import getProps from './services/bit/utils/getProps';
import {Order} from './services/api/getOrders';

const App = createComponent({
  name: 'App',
  State: AppState,
  Actions: AppActions,
  Display({children}) {
    return children;
  },
  ReactContext: createContext({} as unknown),
});

it.todo('should get orders and get customers upon initialization');

describe('handleTakeOrder', () => {
  it('should update order status to taken', () => {
    let orderRef = ordersTable[1];
    const orderId = orderRef.orderId;

    function Interface() {
      const actions = useActions<Methods>({context: 'App'});

      const handleTakeOrder = () => {
        actions.handleTakeOrder(orderId);
        const orders = getProps<Orders>('orders', {context: 'App'});

        // update the order ref to check the updated value
        orderRef = orders[orderId];
      };

      return (
        <TouchableOpacity onPress={handleTakeOrder}>
          <Text>Take order</Text>
        </TouchableOpacity>
      );
    }

    render(
      <App state={{orders: ordersTable}}>
        <Interface />
      </App>,
    );

    expect(orderRef.status).toBe('open');
    fireEvent.press(screen.getByText('Take order'));
    expect(orderRef.status).toBe('taken');
  });

  it('should add expirationDate field when order is taken', () => {
    let orderRef = ordersTable[1] as Order;
    const orderId = orderRef.orderId;

    function Interface() {
      const actions = useActions<Methods>({context: 'App'});

      const handleTakeOrder = () => {
        actions.handleTakeOrder(orderId);
        const orders = getProps<Orders>('orders', {context: 'App'});

        // update the order ref to check the updated value
        orderRef = orders[orderId];
      };

      return (
        <TouchableOpacity onPress={handleTakeOrder}>
          <Text>Take order</Text>
        </TouchableOpacity>
      );
    }

    render(
      <App state={{orders: ordersTable}}>
        <Interface />
      </App>,
    );

    expect(orderRef.expirationDate).toBeUndefined();
    fireEvent.press(screen.getByText('Take order'));
    expect(orderRef.expirationDate).toBeDefined();
  });
});

describe('handleCompleteOrder', () => {
  it.todo('should remove the order in order table');
  it.todo('should add order to completedOrders table');
});

describe('expiredOrders', () => {
  it.todo('should remove the order in order table');
  it.todo('should add order to expiredOrders table');
});
