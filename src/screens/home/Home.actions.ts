import {useNavigation} from '@react-navigation/native';
import {IActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {Orders} from '@/App.state';
import {useEffect} from 'react';

export interface Methods {
  handlePressOrder: (o: Order) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const navigation = useNavigation();
  const completedOrders = useProps<Orders>('completedOrders', {context: 'App'});

  useEffect(() => {
    navigation.setOptions({title: 'Heim'});
  }, []);

  function handlePressOrder(order: Order) {
    type Navigate = (screen: string, payload: Order) => unknown;
    const navigate = navigation.navigate as Navigate;

    navigate('Order', order);
  }

  let totalEarnings = 0;

  Object.keys(completedOrders).forEach(orderId => {
    const order = completedOrders[Number(orderId)];

    totalEarnings += order.totalPrice;

    // deduct the tax if not tax free
    if (order.taxFree === false) {
      const tax = order.totalPrice * 0.21;

      totalEarnings -= tax;
    }
  });

  setState('totalEarnings', totalEarnings);

  // public methods
  return useRegisterActions({
    handlePressOrder,
  });
};

export default AppActions;
