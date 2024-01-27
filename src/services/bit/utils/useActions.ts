import type {IReactContext} from '@/services/bit';
import getContext from '@/services/bit/utils/getContext';
import useActionsByContext from '@/services/bit/utils/useActionsByContext';

interface IActionOptions extends Partial<IReactContext> {
  context: string;
}

const useActions = <T>(options?: IActionOptions): T => {
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

  return useActionsByContext(context);
};

export default useActions;
