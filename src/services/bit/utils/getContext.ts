import type {IReactContext} from '@/services/bit';
import Store from '@/services/bit/store';
import {REGISTRY} from '@/services/bit';
import {UNSAFE_retrieveProperty} from '@/services/global';

const getContext = (name: string) => {
  type IRegistry = Partial<Record<string, Store>>;
  const registry = UNSAFE_retrieveProperty<IRegistry>(REGISTRY);

  const store = registry[name]?.state;

  return store?.__context__ as IReactContext | undefined;
};

export default getContext;
