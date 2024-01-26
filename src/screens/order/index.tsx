import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView, Text, View} from 'react-native';
import {useEffect, useState} from 'react';
import getCustomers, {Customer} from '@/services/api/getCustomers';
import {Order as IOrder} from '@/services/api/getOrders';
import moment from 'moment';

export default function Order() {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params as IOrder;

  const [customers, setCustomers] = useState<Customer[]>([]);

  const handleGetCustomers = async () => {
    const customerResponse = await getCustomers().catch(err => {
      // todo: handle error properly

      console.log(err);
      return []; // fallback
    });

    setCustomers(customerResponse);
  };

  useEffect(() => {
    handleGetCustomers();
    navigation.setOptions({title: `PO-${order.orderId}`});
  }, []);

  const customer = customers.find(
    customer => customer.customerId === order.customerId,
  );

  return (
    <SafeAreaView>
      <View style={{paddingHorizontal: 16}}>
        <Text>
          {order.items.length} item(s) from {customer?.customerName}
        </Text>
        <Text>
          Ordered {moment(order.timestamp).format('DD MMM, ddd. h:mm A')}
        </Text>
        <Text>Order Summary</Text>

        {order.items.map(item => (
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
          <Text>{order.totalPrice}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
