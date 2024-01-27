import createComponent from '@/services/bit';
import Display from './App.display';
import Actions from './App.actions';

export default createComponent({
  name: 'App',
  Display,
  Actions,
});
