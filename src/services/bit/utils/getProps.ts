import {UNSAFE_retrieveProperty} from '@/services/global';
import Store from '@/services/bit/store';
import type {IOptions} from '@/services/bit';
import {REGISTRY} from '@/services/bit';

const getProps = <T>(key: string, options?: IOptions): T => {
  if (options?.context) {
    type IRegistry = Partial<Record<string, Store>>;
    const registry = UNSAFE_retrieveProperty<IRegistry | undefined>(REGISTRY);

    if (!registry) {
      return undefined as T;
    }

    const state = registry[options.context]?.state;
    return state?.[key] as T;
  }

  return undefined as T;
};

export default getProps;
