import {useContext} from 'react';
import type {IContext, IReactContext} from '@/services/bit';
import {Context} from '@/services/bit';

const useBitContext = (context?: IReactContext) =>
  useContext(context || Context) as IContext;

export default useBitContext;
