import {SafeAreaView, Text, View} from 'react-native';
import {Customer} from '@/services/api/getCustomers';
import {Order as IOrder} from '@/services/api/getOrders';
import moment from 'moment';
import {useProps} from '@/services/bit';

export default function Order() {
  const order = useProps<IOrder | undefined>('order');
  const customer = useProps<Customer | undefined>('customer');

  return (
    <SafeAreaView>
      <View style={{paddingHorizontal: 16}}>
        <Text>
          {order?.items.length} item(s) from {customer?.customerName}
        </Text>
        <Text>
          Ordered {moment(order?.timestamp).format('DD MMM, ddd. h:mm A')}
        </Text>
        <Text>Order Summary</Text>

        {order?.items.map(item => (
          <View
            key={item.itemId}
            style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text>
              {item.quantity}x {item.itemName}
            </Text>
            <Text>{item.price}</Text>
          </View>
        ))}

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Subtotal</Text>
          <Text>[totalPrice-tax]</Text>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text>Total</Text>
          <Text>{order?.totalPrice}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
