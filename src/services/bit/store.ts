import get from 'lodash.get';
import set from 'lodash.set';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Obj, Listeners, Actions, GenericFunction} from '@/services/bit';
import {
  UNSAFE_retrieveProperty,
  UNSAFE_registerProperty,
} from '@/services/global';

export const cachePrefix = 'BIT_CACHE';

interface ISubscriptions {
  [key: string]: Set<(state: Obj) => void>;
}

export default class Store {
  public state: Obj;

  public listeners: Listeners = new Map();

  public subscriptionLookup = new Map<(state: Obj) => void, string>();

  public subscriptions: ISubscriptions = {};

  public actions: Actions = {};

  private ws: WebSocket | null = null;

  private name = '';

  constructor(state: Obj) {
    this.state = state;
    this.name = (this.state.__name__ as string) || Store.generateKey();

    this.handleRestoreCachedState();

    this.useDebuggerExtension();
  }

  getState<I>(key: string): I {
    return get(this.state, key) as I;
  }

  setState<I = unknown>(key: string, value: I) {
    this.state = set(this.state, key, value);

    this.subscriptions?.[key]?.forEach(handler => {
      handler(this.state);
    });

    this.handleCacheState(key, value);

    return value;
  }

  setAction(key: string, callback: GenericFunction) {
    this.actions[key] = callback;
  }

  subscribe(key: string, handler: (state: Obj) => void) {
    this.subscriptionLookup.set(handler, key);

    if (!this.subscriptions[key]) {
      this.subscriptions[key] = new Set();
    }

    this.subscriptions[key].add(handler);
  }

  unsubscribe(handler: (state: Obj) => void) {
    const key = this.subscriptionLookup.get(handler);
    if (key) {
      this.subscriptions[key].delete(handler);
      this.subscriptionLookup.delete(handler);
    }
  }

  static generateKey(): string {
    const characters = '0123456789abcdef';
    let uuid = '';

    for (let i = 0; i < 32; i += 1) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uuid += characters[randomIndex];
    }

    // Insert dashes at specific positions
    // prettier-ignore
    uuid = `${uuid.substring(0, 8)}-${uuid.substring(8, 12)}-${uuid.substring(12, 16)}-${uuid.substring(16, 20)}-${uuid.substring(20)}`;

    return uuid;
  }

  useDebuggerExtension() {
    // check if store reference is already registered
    let bitRegistry = UNSAFE_retrieveProperty<Obj>('__BIT_REGISTRY__');

    if (!bitRegistry) {
      UNSAFE_registerProperty('__BIT_REGISTRY__', {});
      bitRegistry = UNSAFE_retrieveProperty('__BIT_REGISTRY__');
    }

    const key = this.name;

    bitRegistry[key] = this;
  }

  private handleCacheState(key: string, value: unknown) {
    const whitelist = this.state.__whitelistedStateKeys__ as string[];
    const whiteListedState = whitelist || [];

    const cacheKey = `${cachePrefix}_${this.name}_${key}`;

    if (whiteListedState.includes(key)) {
      AsyncStorage.setItem(cacheKey, JSON.stringify(value));
    }
  }

  private async handleRestoreCachedState() {
    const whitelist = this.state.__whitelistedStateKeys__ as string[];
    const whiteListedState = whitelist || [];

    const retrievedCachedData = await Promise.all(
      whiteListedState.map(async key => {
        const cacheKey = `${cachePrefix}_${this.name}_${key}`;
        const cachedData: string = (await AsyncStorage.getItem(cacheKey)) || '';

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
      this.setState(key, cachedState[key]);
    });
  }
}
