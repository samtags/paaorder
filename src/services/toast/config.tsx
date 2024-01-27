// App.jsx
import {Obj} from '@/types';
import {BaseToast} from 'react-native-toast-message';

export default {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props: Obj) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#00a4e0', width: '93%', margin: 16}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
      }}
    />
  ),

  error: (props: Obj) => (
    <BaseToast
      {...props}
      style={{borderLeftColor: '#b91c1c', width: '93%', margin: 16}}
      contentContainerStyle={{paddingHorizontal: 15}}
      text1Style={{
        fontSize: 16,
        fontWeight: '700',
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
      }}
    />
  ),
};
