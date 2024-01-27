import {
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react-native';
import {Text, TouchableOpacity} from 'react-native';
import {ReactNode, useEffect, useState} from 'react';
import createComponent, {
  useActions as useActionsHook,
  useProps,
  IWorker,
} from '@/services/bit';
import type {Obj} from '@/index';

const State = {
  count: 7,
};

type Actions = {
  increment: () => void;
};

function HighOrderComponent({children}: {children: ReactNode}) {
  return children;
}

const Worker: IWorker = ({useRegisterActions, getState, setState}) =>
  useRegisterActions({
    increment: () => {
      const count = getState<number>('count');
      setState('count', count + 1);
    },
  });

function Component() {
  const count = useProps<number>('count');
  const actions = useActionsHook<Actions>();

  return (
    <>
      <Text>Hello World</Text>
      <Text testID="question">
        How many times did I greet you? Is it: {count} ?
      </Text>
      <TouchableOpacity
        testID="increment-btn"
        onPress={() => actions.increment()}>
        <Text>Increment</Text>
      </TouchableOpacity>
    </>
  );
}

describe('createComponent method', () => {
  test("Should still work if 'View' is empty", () => {
    const CreatedComponent = createComponent({
      Worker,
      State,
      name: 'EmptyDisplay',
    });

    const {toJSON} = render(<CreatedComponent />);
    const {type} = toJSON() as {type: string};
    expect(type).toBe('View');
  });

  test("Should still work if 'Worker' is empty", () => {
    const CreatedComponent = createComponent({
      View: Component,
      State,
      name: 'EmptyActions',
    });

    render(<CreatedComponent />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  test("Should still work if 'State' is empty", () => {
    const CreatedComponent = createComponent({
      View: Component,
      Worker,
      name: 'EmptyState',
    });

    render(<CreatedComponent />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  test('High order component use case', () => {
    const Component1 = ({children}: {children: ReactNode}) => children;

    const CreatedComponent = createComponent({
      View: Component1,
      Worker,
      State,
      name: 'HighOrderUseCase',
    });

    render(
      <CreatedComponent>
        <HighOrderComponent>
          <Text>Im a high order component</Text>
        </HighOrderComponent>
      </CreatedComponent>,
    );
    expect(screen.getByText('Im a high order component')).toBeTruthy();
  });

  test('High order component use case with no Component', () => {
    const CreatedComponent = createComponent({
      Worker,
      State,
      name: 'HOC',
    });

    render(
      <CreatedComponent>
        <HighOrderComponent>
          <Text>Im a high order component</Text>
        </HighOrderComponent>
      </CreatedComponent>,
    );
    expect(screen.getByText('Im a high order component')).toBeTruthy();
  });

  test('Should still work if no parameters are passed', () => {
    const CreatedComponent = createComponent({name: 'NoParams'});
    render(<CreatedComponent />);
    expect(screen.toJSON()).toBeNull();
  });

  test('the "Component" that passed to createComponent should be displayed', () => {
    const CreatedComponent = createComponent({
      View: Component,
      State,
      name: 'Display',
    });

    render(<CreatedComponent />);
    expect(screen.getByText('Hello World')).toBeTruthy();
  });

  test('the "Worker" that passed to createComponent should be mounted', () => {
    const mockEffect = jest.fn();
    function WorkerParam() {
      useEffect(mockEffect, []);
      return null;
    }
    const CreatedComponent = createComponent({
      Worker: WorkerParam,
      name: 'NoDisplay',
    });
    render(<CreatedComponent />);
    expect(mockEffect).toHaveBeenCalled();
  });

  test("the state that passed to createComponent should be accessible from the 'Component'", () => {
    const CreatedComponent = createComponent({
      View: Component,
      State,
      name: 'StateToDisplay',
    });

    render(<CreatedComponent />);
    expect(
      screen.getByText('How many times did I greet you? Is it: 7 ?'),
    ).toBeTruthy();
  });

  test('From "Worker" actions must be accessible from the "Component"', () => {
    let action = {} as Actions;

    function ViewParam() {
      action = useActionsHook<Actions>();
      return null;
    }

    const CreatedComponent = createComponent({
      View: ViewParam,
      Worker,
      name: 'ActionsToDisplay',
    });

    render(<CreatedComponent />);

    expect(typeof action.increment).toBe('function');
  });

  test('state must be accessible from the "Component"', () => {
    let testCount = 0;

    function ComponentWithStateAccess() {
      const count = useProps<number>('count');

      useEffect(() => {
        testCount = count;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return null;
    }

    const CreatedComponent = createComponent({
      View: ComponentWithStateAccess,
      State,
      name: 'StateToDisplay',
    });

    render(<CreatedComponent />);
    expect(testCount).toBe(7);
  });

  test('state must be accessible from the "Worker"', () => {
    let testCount = 0;

    const WorkerAccessingState: IWorker = ({getState}) => {
      const count = getState<number>('count');

      useEffect(() => {
        testCount = count;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      return null;
    };

    const CreatedComponent = createComponent({
      Worker: WorkerAccessingState,
      State,
      name: 'StateToActions',
    });

    render(<CreatedComponent />);
    expect(testCount).toBe(7);
  });

  test("Should be able to update state from the 'Worker' and receive update in Component", () => {
    const CreatedComponent = createComponent({
      View: Component,
      Worker,
      State,
      name: 'StateMutation',
    });
    render(<CreatedComponent />);

    expect(
      screen.getByText('How many times did I greet you? Is it: 7 ?'),
    ).toBeTruthy();

    const button = screen.getByTestId('increment-btn');
    fireEvent.press(button, 'click');

    expect(
      screen.getByText('How many times did I greet you? Is it: 8 ?'),
    ).toBeTruthy();
  });
});

it('should able to access props from worker', async () => {
  let retrievedProps: string | undefined;

  const Actions: IWorker = ({foo}) => {
    retrievedProps = foo as string;

    return null;
  };

  const CreatedComponent = createComponent({
    name: 'PropsToWorker',
    Worker: Actions,
  });

  render(<CreatedComponent foo="bar" />);
  await waitFor(() => expect(retrievedProps).toBe('bar'), {timeout: 2500});
});

it('should able to receive update if the prop changes', () => {
  function View(props: Obj) {
    const {counter} = props;

    return <Text>Count: {counter as string}</Text>;
  }

  const CreatedComponent = createComponent({
    name: 'PropsToDisplay',
    View,
  });

  function Wrapper() {
    const [counter, setCounter] = useState(0);
    const handleUpdate = () => setCounter(prevState => prevState + 1);

    return (
      <>
        <CreatedComponent counter={counter} />
        <TouchableOpacity onPress={handleUpdate}>
          <Text>Button</Text>
        </TouchableOpacity>
      </>
    );
  }

  render(<Wrapper />);
  fireEvent.press(screen.getByText('Button'));
  expect(screen.getByText('Count: 1')).toBeOnTheScreen();
});
