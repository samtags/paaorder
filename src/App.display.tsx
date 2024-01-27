import Navigator from '@/services/navigator/Navigator';
import {NativeBaseProvider} from 'native-base';
import Toast from '@/services/toast';

export default function App(): React.JSX.Element {
  return (
    <NativeBaseProvider>
      <Navigator />
      <Toast />
    </NativeBaseProvider>
  );
}
