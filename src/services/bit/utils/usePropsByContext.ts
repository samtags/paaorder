import type {IReactContext, IContext} from '@/services/bit';
import {useBitContext} from '@/services/bit';

const usePropsByContext = <T>(key: string, context?: IReactContext): T => {
  const {useProps: useProp} = useBitContext(context) as IContext;
  return useProp<T>(key);
};

export default usePropsByContext;
