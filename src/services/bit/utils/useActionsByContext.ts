import {Context} from 'react';
import type {IContext} from '@/services/bit';
import useBitContext from '@/services/bit/utils/useBitContext';

const useActionsByContext = <T>(context?: Context<unknown>): T => {
  const {actions} = useBitContext(context) as IContext;
  return actions as T;
};

export default useActionsByContext;
