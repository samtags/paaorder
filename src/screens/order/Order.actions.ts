import {useNavigation, useRoute} from '@react-navigation/native';
import {IActions, useActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {useEffect} from 'react';
import {Customer} from '@/services/api/getCustomers';
import {Methods as AppMethods} from '@/App.actions';
import Toast from 'react-native-toast-message';
import moment from 'moment';

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

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const now = moment();
    const expirationDate = moment(order.expirationDate);

    if (now.isAfter(expirationDate)) {
      handleExpiredOrder(order.orderId);

      return () => {};
    }

    if (order.status === 'taken') {
      if (order.expirationDate) {
        // todo: change to native module
        timer = setInterval(() => {
          const remainingSeconds = moment().diff(order.expirationDate, 'seconds'); // prettier-ignore

          if (remainingSeconds <= 0) {
            setState(
              'countdownTimer',
              `${Math.abs(remainingSeconds)}`.padStart(2, '0'),
            );
          }

          if (remainingSeconds === 0) {
            clearInterval(timer);
            handleExpiredOrder(order.orderId);
            return;
          }
        }, 1000);
      }
    }

    return () => {
      clearInterval(timer);
    };
  }, [order.status]);

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

  function handleExpiredOrder(orderId: number) {
    appActions.handleExpiredOrder(orderId);
    Toast.show({
      type: 'error',
      text1: `Expired PO-${orderId}`,
      text2: 'Order has been expired',
      position: 'bottom',
    });
  }

  // public methods
  return useRegisterActions({
    handlePressComplete,
    handleTakeOrder,
  });
};

export default AppActions;
