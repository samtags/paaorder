import createComponent from '@/services/bit';
import Display from './Order.display';
import Actions from './Order.actions';
import State from './Order.state';

export default createComponent({
  name: 'Order',
  Display,
  Actions,
  State,
});
