import {createContext} from 'react';
import createComponent from '@/services/bit';
import Display from './App.display';
import Actions from './App.actions';
import State from './App.state';

export const ReactContext = createContext({} as unknown);

export default createComponent({
  name: 'App',
  Display,
  Actions,
  State,
  ReactContext, // required if want to access props outside its bit context.
});

export * from './App.state';
export type * from './types';
