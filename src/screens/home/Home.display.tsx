import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {useActions, useProps} from '@/services/bit';
import {Customers, Orders} from '@/App.state';
import {Methods} from '@/screens/home/Home.actions';

export default function Home() {
  const orders = useProps<Orders>('orders', {context: 'App'});
  const customers = useProps<Customers>('customers', {context: 'App'});
  const actions = useActions<Methods>();

  return (
    <SafeAreaView>
      {Object.keys(orders).map(orderId => {
        const order = orders[Number(orderId)];
        const customer = customers[order.customerId];

        return (
          <TouchableOpacity
            onPress={() => actions.handlePressOrder(order)}
            key={order.orderId}>
            <View style={{paddingHorizontal: 16}}>
              <Text>PO-{order.orderId}</Text>
              <Text>
                {order.items.length} items for {customer?.customerName}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </SafeAreaView>
  );
}
