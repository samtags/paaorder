import createComponent from '@/services/bit';
import Display from './Home.display';
import Actions from './Home.actions';
import State from './Home.state';

export default createComponent({
  name: 'Home',
  Display,
  Actions,
  State,
});
