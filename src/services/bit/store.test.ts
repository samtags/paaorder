import Store from './store';

const initialState = {
  count: 0,
  query: '',
};

const store = new Store(initialState);

test('Initialize store', () => {
  expect(store.getState('count')).toBe(0);
  expect(typeof store.getState('query')).toBe('string');

  // uninitialized state
  expect(store.getState('foo')).toBeUndefined();
});

test('Get state method must return value of the state', () => {
  expect(store.getState('count')).toBe(0);
});

test('Set state method must update state', () => {
  store.setState('count', 1);
  expect(store.getState('count')).toBe(1);
});

describe('Set action method', () => {
  test('Action property should be an empty object', () => {
    expect(store.actions).toEqual({});
  });

  test('Set action method must add method to actions property.', () => {
    // add action
    store.setAction('increment', () => {
      const count = store.getState<number>('count');
      store.setState('count', count + 1);
    });

    expect(store.actions).toHaveProperty('increment');
  });

  test('Action method must be invoked', () => {
    const mockFn = jest.fn();

    store.setAction('mockFn', mockFn);

    store?.actions?.mockFn();
    expect(mockFn).toHaveBeenCalled();
  });
});

describe('Subscribe method', () => {
  const mockFn = jest.fn();

  test('Subscribe method must add handler to listeners property', () => {
    store.subscribe('count', mockFn);
    expect(store.subscriptions.count.size).toBe(1);
  });

  test('When state is updated listeners must be invoked', () => {
    store.setState('count', 2);
    expect(mockFn).toHaveBeenCalled();
  });

  test('Unsubscribe method must remove handler from listeners property', () => {
    store.unsubscribe(mockFn);
    expect(store.listeners.size).toBe(0);
  });
});
