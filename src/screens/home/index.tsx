import createComponent from '@/services/bit';
import Display from './Home.display';
import Actions from './Home.actions';

export default createComponent({
  name: 'Home',
  Display,
  Actions,
});
