import type {IReactContext} from '@/services/bit';
import getContext from '@/services/bit/utils/getContext';
import usePropsByContext from '@/services/bit/utils/usePropsByContext';

interface IOptions extends Partial<IReactContext> {
  context: string;
}

const useProps = <T>(key: string, options?: IOptions): T => {
  let context: IReactContext | undefined;

  if (options) {
    if (options?.context) {
      const result = getContext(options.context);
      if (result) {
        context = result;
      }
    } else {
      context = options as IReactContext;
    }
  }

  return usePropsByContext(key, context);
};

export default useProps;
