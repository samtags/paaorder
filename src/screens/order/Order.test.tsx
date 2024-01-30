import {createContext} from 'react';
import {NativeBaseProvider} from 'native-base';
import createComponent from '@/services/bit';
import AppState from '@/App.state';
import Order from '@/screens/order';
import {inset} from '@/services/native-base';
import {fireEvent, render, screen} from '@testing-library/react-native';
import ordersTable from '@/__test__/ordersTable';
import amount from '@/services/utils/formatAmount';
import {Order as IOrder} from '@/services/api/getOrders';
import moment from 'moment';

const mockOrder = ordersTable[1];

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: mockOrder,
  }),
  useNavigation: () => ({
    setOptions: () => jest.fn(),
  }),
}));

it('Should display order details', async () => {
  const mockOrder = {
    orderId: 1,
    customerId: 101,
    items: [
      {itemId: 101, itemName: 'Cheeseburger', quantity: 2, price: 9.99},
      {itemId: 102, itemName: 'French Fries', quantity: 1, price: 3.49},
      {itemId: 103, itemName: 'Soda', quantity: 2, price: 1.99},
    ],
    totalPrice: 25.46,
    taxFree: false,
    status: 'open',
    timestamp: '2023-09-20T12:30:45Z',
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  // cheeseburger should be in the item list
  const cheeseBurgerEl = screen.getAllByText(/Cheeseburger/);
  expect(cheeseBurgerEl?.[0]).toBeOnTheScreen();

  // total price should be displayed
  const totalAmountEl = screen.getByText(amount.format(25.46));
  expect(totalAmountEl).toBeOnTheScreen();
});

it('Should show the take order button if order is not yet taken', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'open',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  const takeOrderButton = screen.queryByText('Vorbereiten');
  expect(takeOrderButton).toBeOnTheScreen();
});

it('Should hide the take order button if order is already taken', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'taken',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  const takeOrderButton = screen.queryByText('Vorbereiten');
  expect(takeOrderButton).not.toBeOnTheScreen();
});

it('Should show the complete order button if order is taken', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'taken',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  // take order button is not on screen
  const takeOrderButton = screen.queryByText('Vorbereiten');
  expect(takeOrderButton).not.toBeOnTheScreen();

  // take complete button displayed
  const completeOrderButton = screen.queryByText('Vollständig');
  expect(completeOrderButton).toBeOnTheScreen();
});

it('Should show the timer if the order is taken', () => {
  const now = moment();
  now.add('seconds', 60);

  const mockOrder: Partial<IOrder> = {
    items: [],
    status: 'taken',
    expirationDate: now.toDate(),
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  expect(screen.queryByText('Läuft ab in')).toBeOnTheScreen();
});

it('Take order button should be working', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'open',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  expect(MockHandleTakeOrder).not.toHaveBeenCalled();

  const takeOrderButton = screen.getByText('Vorbereiten');
  fireEvent.press(takeOrderButton);

  expect(MockHandleTakeOrder).toHaveBeenCalled();
});

it('Complete order button should be working', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'taken',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  expect(MockHandleCompleteOrder).not.toHaveBeenCalled();

  const completeOrderButton = screen.getByText('Vollständig');
  fireEvent.press(completeOrderButton);

  expect(MockHandleCompleteOrder).toHaveBeenCalled();
});

it.todo('Expiration countdown');

it('Complete and Take order buttons should not be visible on expired', () => {
  const mockOrder: Partial<IOrder> = {
    status: 'expired',
    items: [],
  };

  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Order />
    </MockApp>,
  );

  const takeOrderButton = screen.queryByText('Vorbereiten');
  const completeOrderButton = screen.queryByText('Vollständig');

  expect(takeOrderButton).not.toBeOnTheScreen();
  expect(completeOrderButton).not.toBeOnTheScreen();
});

const MockHandleTakeOrder = jest.fn();
const MockHandleCompleteOrder = jest.fn();

const MockApp = createComponent({
  name: 'App',
  State: AppState,
  Actions: ({useRegisterActions}) =>
    useRegisterActions({
      handleTakeOrder: MockHandleTakeOrder,
      handleCompleteOrder: MockHandleCompleteOrder,
    }),
  Display: ({children}) => {
    return (
      <NativeBaseProvider initialWindowMetrics={inset}>
        {children}
      </NativeBaseProvider>
    );
  },
  ReactContext: createContext({} as unknown),
});
