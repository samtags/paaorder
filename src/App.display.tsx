import Navigator from '@/services/navigator/Navigator';
import {NativeBaseProvider} from 'native-base';

export default function App(): React.JSX.Element {
  return (
    <NativeBaseProvider>
      <Navigator />
    </NativeBaseProvider>
  );
}
