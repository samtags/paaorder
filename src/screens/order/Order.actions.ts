import {useNavigation, useRoute} from '@react-navigation/native';
import {IActions, useActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {useEffect} from 'react';
import {Customer} from '@/services/api/getCustomers';
import {Methods as AppMethods} from '@/App.actions';

export interface Methods {
  handlePressComplete: (orderId: number) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const appActions = useActions<AppMethods>({context: 'App'});
  const navigation = useNavigation();
  const route = useRoute();

  const order = route.params as Order;
  setState<Order>('order', order);

  const customer = useProps<Customer>(`customers.${order.customerId}`, {context: 'App'}); // prettier-ignore
  setState<Customer>('customer', customer);

  useEffect(() => {
    navigation.setOptions({title: `PO-${order.orderId}`});
  }, []);

  function handlePressComplete(id: number) {
    appActions.handleCompleteOrder(id);

    navigation.goBack();

    // todo: show snackbar
  }

  // public methods
  return useRegisterActions({
    handlePressComplete,
  });
};

export default AppActions;
