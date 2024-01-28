import createComponent from '@/services/bit';
import Display from './Expired.display';
import Actions from './Expired.actions';
import State from './Expired.state';

export default createComponent({
  name: 'Home',
  Display,
  Actions,
  State,
});
