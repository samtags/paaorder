import {VStack} from 'native-base';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {useActions, useProps} from '@/services/bit';
import {Customers, Orders} from '@/App.state';
import {Methods} from '@/screens/home/Home.actions';

export default function Home() {
  const totalEarnings = useProps<number>('totalEarnings');
  const orders = useProps<Orders>('orders', {context: 'App'});
  const customers = useProps<Customers>('customers', {context: 'App'});
  const actions = useActions<Methods>();

  return (
    <SafeAreaView>
      <VStack space={5} px={4}>
        <VStack>
          <Text>Earnings</Text>
          <Text>€ {totalEarnings ?? 0}</Text>
        </VStack>
        {Object.keys(orders).map(orderId => {
          const order = orders[Number(orderId)];
          const customer = customers[order.customerId];

          return (
            <TouchableOpacity
              onPress={() => actions.handlePressOrder(order)}
              key={order.orderId}>
              <VStack>
                <Text>PO-{order.orderId}</Text>
                <Text>
                  {order.items.length} items for {customer?.customerName}
                </Text>
              </VStack>
            </TouchableOpacity>
          );
        })}
      </VStack>
    </SafeAreaView>
  );
}
