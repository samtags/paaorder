import {IActions, useProps} from '@/services/bit';
import {Order} from '@/services/api/getOrders';
import {Orders} from '@/App.state';
import {navigate} from '@/services/navigator';
import {TAX_PERCENTAGE} from '@/configs/app';

export interface Methods {
  handlePressOrder: (o: Order) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions, setState}) => {
  const expiredOrders = useProps<Orders>('expiredOrders', {context: 'App'});

  function handlePressOrder(order: Order) {
    navigate('Preview', order);
  }

  let totalEarnings = 0;

  Object.keys(expiredOrders).forEach(orderId => {
    const order = expiredOrders[Number(orderId)];

    totalEarnings += order.totalPrice;

    // deduct the tax if not tax free
    if (order.taxFree === false) {
      const tax = order.totalPrice * TAX_PERCENTAGE;

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
