import {Center, Text as Span, HStack, Box, VStack, Image} from 'native-base';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {useActions, useProps} from '@/services/bit';
import {Customers, Orders} from '@/App.state';
import {Methods} from '@/screens/home/Home.actions';
import Optional from '@/components/optional';
import amount from '@/services/utils/formatAmount';

const Arrow = require('@/assets/png/arrow-right.png');

export default function Home() {
  const totalEarnings = useProps<number>('totalEarnings');
  const orders = useProps<Orders>('orders', {context: 'App'});
  const completedOrders = useProps<Orders>('completedOrders', {context: 'App'});
  const customers = useProps<Customers>('customers', {context: 'App'});
  const actions = useActions<Methods>();

  const openOrdersCount = Object.keys(orders).length;
  const completedOrdersCount = Object.keys(completedOrders).length;

  return (
    <SafeAreaView>
      <VStack>
        <Center mt={8}>
          <Span fontSize="4xl" fontWeight="medium" color="#00263e">
            {amount.format(totalEarnings)}
          </Span>
          <Span color="gray.400" textAlign="center" maxW={280}>
            Dies ist Ihr Umsatz vor Anpassungen und Abzügen
          </Span>
        </Center>

        <HStack space={2} mt={8} px={4}>
          <Box flex={1} flexShrink={0}>
            <TouchableOpacity>
              {/* prettier-ignore */}
              <HStack alignItems="center" justifyContent="center" bgColor="#00a4e0" rounded="xl" space={2} p={5}>
                <Span fontSize="2xl" fontWeight="bold" color="white">
                  {completedOrdersCount}
                </Span>
                <Span color="white">Abgeschlossene</Span>
              </HStack>
            </TouchableOpacity>
          </Box>
          <Box flex={1} flexShrink={0}>
            <TouchableOpacity>
              {/* prettier-ignore */}
              <HStack alignItems="center" justifyContent="center" bgColor="#00263e" rounded="xl" space={4} p={5}>
                <Span fontSize="2xl" color="white" fontWeight="bold">
                  0
                </Span>
                <Span color="white">Abgelaufene</Span>
              </HStack>
            </TouchableOpacity>
          </Box>
        </HStack>

        <Box my={8} px={4}>
          <Span fontSize="xl" fontWeight="medium" color="#00263e">
            Aufträge
          </Span>
          <Optional condition={Boolean(openOrdersCount)}>
            <Span color="gray.400">
              Sie haben ({openOrdersCount}) offene Bestellungen
            </Span>
          </Optional>

          <Optional condition={openOrdersCount === 0}>
            <Span color="gray.400">
              Alles aufgeholt! Warten auf neue Bestellungen.
            </Span>
          </Optional>
        </Box>

        <VStack space={2}>
          {Object.keys(orders).map(orderId => {
            const order = orders[Number(orderId)];
            const customer = customers[order.customerId];

            return (
              <TouchableOpacity
                onPress={() => actions.handlePressOrder(order)}
                key={order.orderId}>
                <Box bgColor="white" px={4} py={2}>
                  <HStack alignItems="center" justifyContent="space-between">
                    <VStack py={2}>
                      <Span fontWeight="medium" fontSize="lg">
                        PO-{order.orderId}
                      </Span>
                      <Span color="gray.400">
                        {order.items.length} items for {customer?.customerName}
                      </Span>
                    </VStack>
                    {/* prettier-ignore */}
                    <Image h={3.5} w={3.5} resizeMode="contain" source={Arrow} alt="Arrow"/>
                  </HStack>
                </Box>
              </TouchableOpacity>
            );
          })}
        </VStack>
      </VStack>
    </SafeAreaView>
  );
}
