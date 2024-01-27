import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import Home from '@/screens/home';
import Order from '@/screens/order';

const Stack = createNativeStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} options={{title: 'Heim'}} />
        <Stack.Screen name="Order" component={Order} options={{title: ''}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
