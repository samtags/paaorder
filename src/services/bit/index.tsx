import {View as RNView} from 'react-native';
import {
  ReactNode,
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import get from 'lodash.get';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Store, {cachePrefix} from '@/services/bit/store';
import type {Obj} from '@/index';
import type {
  Params,
  Actions,
  IContext,
  IReactContext,
  BitBundlerComponentProps,
} from '@/services/bit';

export const Context = createContext<unknown>({});

export const REGISTRY = '__BIT_REGISTRY__';

export const useBitContext = (context?: IReactContext) =>
  useContext(context || Context) as IContext;

const createComponent = ({
  View,
  Worker,
  State = {},
  ReactContext,
  name,
  whitelistedStateKeys,
}: Params): FC<{
  children?: ReactNode;
  state?: Obj;
  [key: string]: unknown;
}> => {
  let Provider = Context;

  if (ReactContext) {
    Provider = ReactContext;
  }

  if (name) {
    State.__name__ = name;
    State.__whitelistedStateKeys__ = whitelistedStateKeys;
    State.__context__ = Provider;
  }

  const initialStateReference = {...State};
  const store = new Store(State);

  const usePropsHook = (key: string) => {
    const [hookState, setHookState] = useState(() => store.getState(key));

    useEffect(() => {
      const handler = (state: Obj) => {
        setHookState(get(state, key));
      };

      // subscribe to the root key if the key provided is nested object
      const rootKey = key.match(/^[^[\].]+/)?.[0] ?? key;

      const initialState = hookState;
      const onMountState = store.getState(key);

      if (initialState !== onMountState) {
        setHookState(onMountState);
      }

      store.subscribe(rootKey, handler);

      return () => {
        store.unsubscribe(handler);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return hookState;
  };

  // worker props
  const useActionsHook = (payload: unknown) => {
    const actions = payload as Actions;

    Object.keys(actions).forEach(key => {
      store.setAction(key, actions[key]);
    });

    return null;
  };

  // worker props

  const getState = <T,>(key: string): T => store.getState<T>(key);

  const setState = <T,>(key: string, value: T): T =>
    store.setState<T>(key, value);

  // exposes props to the context consumer
  const ConsumerProps: Obj = {
    useProps: usePropsHook,
    actions: store.actions,
  };

  if (ReactContext) {
    ConsumerProps.store = store;
  }

  let ViewComponent: FC<{children: ReactNode}>;
  let WorkerComponent: FC<{[key: string]: unknown}>;

  if (View) {
    ViewComponent = View;
  } else {
    ViewComponent = function ViewComp({children}) {
      return children;
    };
  }

  if (Worker) {
    WorkerComponent = Worker as FC;
  }

  function BitBundlerComponent(props: BitBundlerComponentProps) {
    const {children, state, ...accessToProps} = props;
    const [isReady, setIsReady] = useState(false);

    async function componentWillMount() {
      /** store cached values */
      const whitelist = initialStateReference.__whitelistedStateKeys__ as string[]; // prettier-ignore

      const whiteListedState = whitelist || [];

      if (whiteListedState.length > 0) {
        const retrievedCachedData = await Promise.all(
          whiteListedState.map(async key => {
            const cacheKey = `${cachePrefix}_${name}_${key}`;
            const cachedData: string =
              (await AsyncStorage.getItem(cacheKey)) || '';
            return cachedData;
          }),
        );

        const cachedState: Obj = {};

        retrievedCachedData.forEach((data, index) => {
          try {
            cachedState[whiteListedState[index]] = JSON.parse(data);
          } catch (err) {
            console.warn('Error parsing cached data', err);
          }
        });

        Object.keys(cachedState).forEach(key => {
          store.setState(key, cachedState[key]);
        });
      }
      /** & store cached values */

      /** reinitialize default state on remount */
      Object.keys(State).forEach(key => {
        if (whiteListedState.includes(key)) return;

        // todo: if key starts with double underscore then ignore.
        store.setState(key, initialStateReference[key]);
      });
      /** & reinitialize default state on remount */

      /** map props to state */
      if (state) {
        Object.keys(state).forEach(key => {
          store.setState(key, state[key]);
        });
      }
      /** & map props to state */

      setIsReady(true);
    }

    useEffect(() => {
      componentWillMount();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!isReady) {
      return null;
    }

    return (
      <Provider.Provider value={ConsumerProps}>
        <ViewComponent {...accessToProps}>{children}</ViewComponent>
        {Worker && (
          <RNView style={{display: 'none'}}>
            <WorkerComponent
              useRegisterActions={useActionsHook}
              getState={getState}
              setState={setState}
              {...props}
            />
          </RNView>
        )}
      </Provider.Provider>
    );
  }

  return BitBundlerComponent;
};

export default createComponent;
export * from './types';
export {default as useActions} from '@/services/bit/utils/useActions';
export {default as useProps} from '@/services/bit/utils/useProps';
