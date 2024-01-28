import {IActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {Orders} from '@/App.state';
import {navigate} from '@/services/navigator';

export interface Methods {
  handlePressOrder: (o: Order) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const completedOrders = useProps<Orders>('completedOrders', {context: 'App'});

  function handlePressOrder(order: Order) {
    navigate('Preview', order);
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
