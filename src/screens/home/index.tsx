import {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import getOrders, {Order} from '@/services/api/getOrders';
import {useNavigation} from '@react-navigation/native';
import getCustomers, {Customer} from '@/services/api/getCustomers';

export default function Home() {
  const navigation = useNavigation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const handleGetOrders = async () => {
    const orderResponse = await getOrders().catch(err => {
      // todo: handle error properly

      console.log(err);
      return []; // fallback
    });

    setOrders(orderResponse);
  };

  const handleGetCustomers = async () => {
    const customerResponse = await getCustomers().catch(err => {
      // todo: handle error properly

      console.log(err);
      return []; // fallback
    });

    setCustomers(customerResponse);
  };

  const handlePressOrder = (order: Order) => {
    type Navigate = (screen: string, payload: Order) => unknown;
    const navigate = navigation.navigate as Navigate;

    navigate('Order', order);
  };

  useEffect(() => {
    handleGetOrders();
    handleGetCustomers();
  }, []);

  return (
    <SafeAreaView>
      {orders.map(order => {
        const customer = customers.find(
          cs => cs.customerId === order.customerId,
        );

        return (
          <TouchableOpacity
            onPress={() => handlePressOrder(order)}
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
