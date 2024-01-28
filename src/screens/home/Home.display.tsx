import {HStack, Box, VStack} from 'native-base';
import {SafeAreaView} from 'react-native';
import {useActions, useProps} from '@/services/bit';
import {Customers, Orders} from '@/App.state';
import {Methods} from '@/screens/home/Home.actions';
import {Order} from '@/services/api/getOrders';
import Earnings from '@/components/earnings';
import Banner from '@/components/banner';
import Heading from '@/components/heading';
import Card from '@/components/card';

export default function Home() {
  const actions = useActions<Methods>();

  const orders = useProps<Orders>('orders', {context: 'App'});
  const completedOrders = useProps<Orders>('completedOrders', {context: 'App'});
  const expiredOrders = useProps<Orders>('expiredOrders', {context: 'App'});
  const customers = useProps<Customers>('customers', {context: 'App'});

  const totalEarnings = useProps<number>('totalEarnings');

  const openOrdersCount = Object.keys(orders).length;
  const completedOrdersCount = Object.keys(completedOrders).length;
  const expiredOrdersCount = Object.keys(expiredOrders).length;

  return (
    <SafeAreaView>
      <VStack pt={8}>
        <Earnings total={totalEarnings} />

        <HStack space={2} mt={8} px={4}>
          <Banner
            value={completedOrdersCount}
            label="Abgeschlossene"
            color="#00a4e0"
            onPress={() => actions.handleRedirectToCompleted()}
          />
          <Banner
            value={expiredOrdersCount}
            label="Abgelaufene"
            color="#00263e"
            onPress={() => actions.handleRedirectToExpired()}
          />
        </HStack>

        <Box my={8} px={4}>
          <Heading title="Aufträge" count={openOrdersCount} />
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
