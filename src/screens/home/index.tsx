import {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import getOrders, {Order} from '../../services/api/getOrders';

export default function Home() {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleGetOrders = async () => {
    const orderResponse = await getOrders().catch(err => {
      // todo: handle error properly

      console.log(err);
      return []; // fallback
    });

    setOrders(orderResponse);
  };

  useEffect(() => {
    handleGetOrders();
  }, []);

  return (
    <SafeAreaView>
      {orders.map(order => (
        <TouchableOpacity key={order.orderId}>
          <View style={{paddingHorizontal: 16}}>
            <Text>PO-{order.orderId}</Text>
            <Text>{order.items.length} items for [user]</Text>
          </View>
        </TouchableOpacity>
      ))}
    </SafeAreaView>
  );
}
