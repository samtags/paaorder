import {UNSAFE_retrieveProperty} from '@/services/global';
import {REGISTRY} from '@/services/bit';
import type {IOptions} from '@/services/bit';
import Store from '@/services/bit/store';

export const getActions = <T>(options?: IOptions): T => {
  if (options?.context) {
    type IRegistry = Partial<Record<string, Store>>;
    const registry = UNSAFE_retrieveProperty<IRegistry>(REGISTRY);
    return registry[options.context]?.actions as T;
  }

  return {} as T;
};

export default getActions;
