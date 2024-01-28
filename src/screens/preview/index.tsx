import createComponent from '@/services/bit';
import Display from './Preview.display';
import Actions from './Preview.actions';
import State from './Preview.state';

export default createComponent({
  name: 'Order',
  Display,
  Actions,
  State,
});
