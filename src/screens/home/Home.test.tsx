import mockOrders from '@/__test__/ordersTable';
import {fireEvent, render, screen} from '@testing-library/react-native';
import createComponent from '@/services/bit';
import {createContext} from 'react';
import Home from '@/screens/home';
import {NativeBaseProvider} from 'native-base';
import AppState from '@/App.state';
import {inset} from '@/services/native-base';
import NavigationContainer from '@/services/navigator/Container';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Text} from 'react-native';
import {Order} from '@/services/api/getOrders';
import amount from '@/services/utils/formatAmount';
import {TAX_PERCENTAGE} from '@/configs/app';

it('Should display orders', async () => {
  render(
    <MockApp state={{orders: mockOrders}}>
      <Home />
    </MockApp>,
  );

  const orderCount = Object.keys(mockOrders).length;
  expect(screen.queryAllByText(/PO-/).length).toBe(orderCount);
});

describe('Should calculated earnings', () => {
  type Orders = {[key: number]: Partial<Order>};

  it('Without tax', () => {
    // total should be 20
    const mockCompletedOrdersWithoutTax: Orders = {
      1: {orderId: 1, totalPrice: 10},
      2: {orderId: 2, totalPrice: 10},
    };

    render(
      <MockApp state={{completedOrders: mockCompletedOrdersWithoutTax}}>
        <Home />
      </MockApp>,
    );
    expect(screen.getByText(amount.format(20))).toBeOnTheScreen();
  });

  it('With tax', () => {
    const mockCompletedOrdersWithTax: Orders = {
      1: {orderId: 1, totalPrice: 50, taxFree: false},
      2: {orderId: 2, totalPrice: 50, taxFree: false},
    };

    const total = 100;
    const afterTax = total - total * TAX_PERCENTAGE;

    render(
      <MockApp state={{completedOrders: mockCompletedOrdersWithTax}}>
        <Home />
      </MockApp>,
    );

    expect(screen.getByText(amount.format(afterTax))).toBeOnTheScreen();
  });

  it('Combination of with tax and without tax', () => {
    const mockCompletedOrders: Orders = {
      1: {orderId: 1, totalPrice: 100, taxFree: false}, // 100
      2: {orderId: 2, totalPrice: 100, taxFree: true}, // 100 minus total price times tax
    };

    const total = 200;
    const taxInSecondOrder = 100 * TAX_PERCENTAGE;

    const totalPriceAfterTax = total - taxInSecondOrder;

    render(
      <MockApp state={{completedOrders: mockCompletedOrders}}>
        <Home />
      </MockApp>,
    );

    expect(
      screen.getByText(amount.format(totalPriceAfterTax)),
    ).toBeOnTheScreen();
  });
});

it('Should redirect to completed', () => {
  const Stack = createNativeStackNavigator();
  const MockCompleted = () => <Text>Completed Screen</Text>;

  render(
    <MockApp>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* prettier-ignore */}
          <Stack.Screen name="Home" component={Home} options={{title: 'Heim'}} />
          <Stack.Screen name="Completed" component={MockCompleted} />
        </Stack.Navigator>
      </NavigationContainer>
    </MockApp>,
  );

  const completedButtonElement = screen.getByText('Abgeschlossene');
  fireEvent.press(completedButtonElement);

  // Mock completed screen should be displayed in the screen
  expect(screen.getByText('Completed Screen')).toBeOnTheScreen();
});

it('Should redirect to expired', () => {
  const Stack = createNativeStackNavigator();
  const MockExpired = () => <Text>Expired bookings</Text>;

  render(
    <MockApp>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* prettier-ignore */}
          <Stack.Screen name="Home" component={Home} options={{title: 'Heim'}} />
          <Stack.Screen name="Expired" component={MockExpired} />
        </Stack.Navigator>
      </NavigationContainer>
    </MockApp>,
  );

  const expiredButtonElement = screen.getByText('Abgelaufene');
  fireEvent.press(expiredButtonElement);

  // Mock completed screen should be displayed in the screen
  expect(screen.getByText('Expired bookings')).toBeOnTheScreen();
});

it('Should able to preview order details', () => {
  const Stack = createNativeStackNavigator();
  const MockOrderScreen = () => <Text>Order Details</Text>;

  render(
    <MockApp state={{orders: mockOrders}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          {/* prettier-ignore */}
          <Stack.Screen name="Home" component={Home} options={{title: 'Heim'}} />
          <Stack.Screen name="Order" component={MockOrderScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </MockApp>,
  );

  const firstOrder = screen.getByText(/PO-1/);
  fireEvent.press(firstOrder);

  expect(screen.getByText('Order Details')).toBeOnTheScreen();
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
