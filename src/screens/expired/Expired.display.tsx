import {Box, VStack} from 'native-base';
import {SafeAreaView} from 'react-native';
import {useActions, useProps} from '@/services/bit';
import {Customers, Orders} from '@/App.state';
import {Methods} from '@/screens/completed/Completed.actions';
import {Order} from '@/services/api/getOrders';
import Earnings from '@/components/earnings';
import Heading from '@/components/heading';
import Card from '@/components/card';

export default function Home() {
  const actions = useActions<Methods>();

  const orders = useProps<Orders>('expiredOrders', {context: 'App'});
  const customers = useProps<Customers>('customers', {context: 'App'});

  const totalEarnings = useProps<number>('totalEarnings');

  const openOrdersCount = Object.keys(orders).length;

  return (
    <SafeAreaView>
      <VStack pt={8}>
        <Earnings total={totalEarnings} />

        <Box my={8} px={4}>
          <Heading title="Abgelaufene Bestellungen" count={openOrdersCount} />
        </Box>

        <VStack space={2}>
          {/* todo: implement in flat list */}
          {Object.keys(orders).map(orderId => {
            const order: Order | undefined = orders[Number(orderId)];
            const customer = customers[order?.customerId];

            return (
              <Card
                key={order.orderId}
                title={`PO-${order?.orderId}`}
                onPress={() => actions.handlePressOrder(order)}
                customerName={customer?.customerName ?? ''}
                itemCount={order?.items.length ?? 0}
              />
            );
          })}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
