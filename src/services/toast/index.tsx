import Toast from 'react-native-toast-message';
import config from './config';

export default function ToastProvider() {
  return <Toast config={config} />;
}
