import {useNavigation, useRoute} from '@react-navigation/native';
import {IActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {useEffect} from 'react';
import {Customer} from '@/services/api/getCustomers';

export interface Methods {
  //
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const navigation = useNavigation();
  const route = useRoute();

  const order = route.params as Order;
  setState<Order>('order', order);

  const customer = useProps<Customer>(`customers.${order.customerId}`, {context: 'App'}); // prettier-ignore
  setState<Customer>('customer', customer);

  useEffect(() => {
    navigation.setOptions({title: `PO-${order.orderId}`});
  }, []);

  // public methods
  return useRegisterActions({});
};

export default AppActions;
