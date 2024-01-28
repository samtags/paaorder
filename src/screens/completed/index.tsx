import createComponent from '@/services/bit';
import Display from './Completed.display';
import Actions from './Completed.actions';
import State from './Completed.state';

export default createComponent({
  name: 'Home',
  Display,
  Actions,
  State,
});
