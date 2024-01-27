import {VStack, HStack, Center} from 'native-base';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {Customer} from '@/services/api/getCustomers';
import {Order as IOrder} from '@/services/api/getOrders';
import moment from 'moment';
import {useActions, useProps} from '@/services/bit';
import {Methods} from './Order.actions';

export default function Order() {
  const order = useProps<IOrder | undefined>('order');
  const customer = useProps<Customer | undefined>('customer');
  const actions = useActions<Methods>();

  console.log('🚀 ~ Order ~ order:', order?.status);

  return (
    <SafeAreaView>
      <VStack p={4}>
        <Text>
          {order?.items.length} item(s) from {customer?.customerName}
        </Text>
        <Text>
          Ordered {moment(order?.timestamp).format('DD MMM, ddd. h:mm A')}
        </Text>
        <VStack mt={4} />
        <Text>Order Summary</Text>

        <VStack py={4}>
          {order?.items.map(item => (
            <HStack key={item.itemId} justifyContent="space-between">
              <Text>
                {item.quantity}x {item.itemName}
              </Text>
              <Text>{item.price}</Text>
            </HStack>
          ))}
        </VStack>

        <HStack justifyContent="space-between">
          <Text>Subtotal</Text>
          <Text>[totalPrice-tax]</Text>
        </HStack>
        <HStack justifyContent="space-between">
          <Text>Total</Text>
          <Text>{order?.totalPrice}</Text>
        </HStack>
      </VStack>
      <VStack p={4}>
        <TouchableOpacity
          onPress={() => actions?.handlePressComplete(Number(order?.orderId))}>
          <Center p={4} bgColor="#00a4e0" rounded="lg">
            <Text>Complete</Text>
          </Center>
        </TouchableOpacity>
      </VStack>
    </SafeAreaView>
  );
}
