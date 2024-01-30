import {createContext} from 'react';
import {NativeBaseProvider} from 'native-base';
import createComponent from '@/services/bit';
import AppState from '@/App.state';
import Preview from '@/screens/preview';
import {inset} from '@/services/native-base';
import {render, screen} from '@testing-library/react-native';
import amount from '@/services/utils/formatAmount';

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

jest.mock('@react-navigation/native', () => ({
  useRoute: () => ({
    params: mockOrder,
  }),
  useNavigation: () => ({
    setOptions: () => jest.fn(),
  }),
}));

it('Should display order details', async () => {
  render(
    <MockApp state={{orders: {1: mockOrder}}}>
      <Preview />
    </MockApp>,
  );

  // cheeseburger should be in the item list
  const cheeseBurgerEl = screen.getAllByText(/Cheeseburger/);
  expect(cheeseBurgerEl?.[0]).toBeOnTheScreen();

  // total price should be displayed
  const totalAmountEl = screen.getByText(amount.format(25.46));
  expect(totalAmountEl).toBeOnTheScreen();
});

const MockApp = createComponent({
  name: 'App',
  State: AppState,
  Display: ({children}) => {
    return (
      <NativeBaseProvider initialWindowMetrics={inset}>
        {children}
      </NativeBaseProvider>
    );
  },
  ReactContext: createContext({} as unknown),
});
