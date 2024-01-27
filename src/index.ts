import createComponent from '@/services/bit';
import Display from './App.display';
import Actions from './App.actions';
import State from './App.state';

export default createComponent({
  name: 'App',
  Display,
  Actions,
  State,
});

export * from './App.state';
