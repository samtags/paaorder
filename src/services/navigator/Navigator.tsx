import {createNativeStackNavigator} from '@react-navigation/native-stack';

import Home from '@/screens/home';
import Order from '@/screens/order';
import Completed from '@/screens/completed';
import Preview from '@/screens/preview';
import Expired from '@/screens/expired';
import Container from '@/services/navigator/Container';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <Container>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Heim'}} />
        <Stack.Screen name="Order" component={Order} options={{title: ''}} />
        <Stack.Screen
          name="Completed"
          component={Completed}
          options={{title: 'Abgeschlossene'}}
        />
        <Stack.Screen
          name="Expired"
          component={Expired}
          options={{title: 'Abgelaufene'}}
        />
        <Stack.Screen
          name="Preview"
          component={Preview}
          options={{title: ''}}
        />
      </Stack.Navigator>
    </Container>
  );
}
