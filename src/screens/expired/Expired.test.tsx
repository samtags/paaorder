import mockExpiredOrders from '@/__test__/ordersTable';
import {fireEvent, render, screen} from '@testing-library/react-native';
import createComponent from '@/services/bit';
import {createContext} from 'react';
import Expired from '@/screens/expired';
import {NativeBaseProvider} from 'native-base';
import AppState from '@/App.state';
import {inset} from '@/services/native-base';
import {Order} from '@/services/api/getOrders';
import amount from '@/services/utils/formatAmount';
import {TAX_PERCENTAGE} from '@/configs/app';
import NavigationContainer from '@/services/navigator/Container';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'react-native';

it('Should show expired orders', async () => {
  render(
    <MockApp state={{expiredOrders: mockExpiredOrders}}>
      <Expired />
    </MockApp>,
  );

  const orderCount = Object.keys(mockExpiredOrders).length;
  expect(screen.queryAllByText(/PO-/).length).toBe(orderCount);
});

describe('Should calculated earnings', () => {
  type Orders = {[key: number]: Partial<Order>};

  it('Without tax', () => {
    // total should be 20
    const mockExpiredOrdersWithoutTax: Orders = {
      1: {items: [], orderId: 1, totalPrice: 10},
      2: {items: [], orderId: 2, totalPrice: 10},
    };

    render(
      <MockApp state={{expiredOrders: mockExpiredOrdersWithoutTax}}>
        <Expired />
      </MockApp>,
    );
    expect(screen.getByText(amount.format(20))).toBeOnTheScreen();
  });

  it('With tax', () => {
    const mockExpiredOrdersWithTax: Orders = {
      1: {items: [], orderId: 1, totalPrice: 50, taxFree: false},
      2: {items: [], orderId: 2, totalPrice: 50, taxFree: false},
    };

    const total = 100;
    const afterTax = total - total * TAX_PERCENTAGE;

    render(
      <MockApp state={{expiredOrders: mockExpiredOrdersWithTax}}>
        <Expired />
      </MockApp>,
    );

    expect(screen.getByText(amount.format(afterTax))).toBeOnTheScreen();
  });

  it('Combination of with tax and without tax', () => {
    const mockExpiredOrders: Orders = {
      1: {items: [], orderId: 1, totalPrice: 100, taxFree: false}, // 100
      2: {items: [], orderId: 2, totalPrice: 100, taxFree: true}, // 100 minus total price times tax
    };

    const total = 200;
    const taxInSecondOrder = 100 * TAX_PERCENTAGE;

    const totalPriceAfterTax = total - taxInSecondOrder;

    render(
      <MockApp state={{expiredOrders: mockExpiredOrders}}>
        <Expired />
      </MockApp>,
    );

    expect(
      screen.getByText(amount.format(totalPriceAfterTax)),
    ).toBeOnTheScreen();
  });
});

it('Should be able to preview order', () => {
  const Stack = createNativeStackNavigator();

  const MockPreviewComponent = () => <Text>Order Preview</Text>;

  render(
    <MockApp state={{expiredOrders: mockExpiredOrders}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* prettier-ignore */}
          <Stack.Screen name="Completed" component={Expired} />
          <Stack.Screen name="Preview" component={MockPreviewComponent} />
        </Stack.Navigator>
      </NavigationContainer>
    </MockApp>,
  );

  const orders = screen.queryAllByText(/PO-/);

  // press the first order
  const firstOrder = orders[0];
  fireEvent.press(firstOrder);

  // should be redirected to new screen
  expect(screen.queryByText('Order Preview')).toBeOnTheScreen();
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