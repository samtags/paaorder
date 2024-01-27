import {useNavigation, useRoute} from '@react-navigation/native';
import {IActions, useActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {useEffect} from 'react';
import {Customer} from '@/services/api/getCustomers';
import {Methods as AppMethods} from '@/App.actions';
import Toast from 'react-native-toast-message';

export interface Methods {
  handlePressComplete: (orderId: number) => unknown;
  handleTakeOrder: (orderId: number) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const appActions = useActions<AppMethods>({context: 'App'});
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Order;
  const order = useProps<Order>(`orders.${routeParams.orderId}`, {context: 'App'}); //prettier-ignore
  setState<Order>('order', order);

  const customer = useProps<Customer>(`customers.${order.customerId}`, {context: 'App'}); // prettier-ignore
  setState<Customer>('customer', customer);

  useEffect(() => {
    navigation.setOptions({title: `PO-${order.orderId}`});
  }, []);

  function handlePressComplete(id: number) {
    appActions.handleCompleteOrder(id);

    Toast.show({
      type: 'success',
      text1: `Served PO-${id}`,
      text2: `Order has been served! Earned ${order.totalPrice} 🎉`,
      position: 'bottom',
    });

    navigation.goBack();
  }

  function handleTakeOrder(orderId: number) {
    appActions.handleTakeOrder(orderId);
  }

  // public methods
  return useRegisterActions({
    handlePressComplete,
    handleTakeOrder,
  });
};

export default AppActions;
