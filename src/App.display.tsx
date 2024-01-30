import Navigator from '@/services/navigator/Navigator';
import {NativeBaseProvider} from 'native-base';
import Toast from '@/services/toast';
import {ReactNode} from 'react';
import {inset} from './services/native-base';

interface Props {
  children?: ReactNode;
}

export default function App(props: Props): React.JSX.Element {
  return (
    <NativeBaseProvider initialWindowMetrics={inset}>
      <Navigator />
      <Toast />
      {props?.children ?? null}
    </NativeBaseProvider>
  );
}
