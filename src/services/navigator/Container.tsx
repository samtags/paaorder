import {ReactNode} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '@/services/navigator';

export default function Container(props: {children: ReactNode}) {
  return (
    <NavigationContainer ref={navigationRef}>
      {props.children}
    </NavigationContainer>
  );
}
