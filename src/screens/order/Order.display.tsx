import {Box, VStack, HStack, Center, Text as Span} from 'native-base';
import {SafeAreaView, TouchableOpacity} from 'react-native';
import {Customer} from '@/services/api/getCustomers';
import {Order as IOrder} from '@/services/api/getOrders';
import moment from 'moment';
import {useActions, useProps} from '@/services/bit';
import {Methods} from './Order.actions';
import amount from '@/services/utils/formatAmount';

export default function Order() {
  const order = useProps<IOrder | undefined>('order');
  const customer = useProps<Customer | undefined>('customer');
  const actions = useActions<Methods>();

  return (
    <SafeAreaView style={{height: '100%'}}>
      <VStack flex={1} justifyContent="space-between">
        <VStack flex={1}>
          <VStack pt={4} px={4} mb={1} bgColor="white">
            <Span fontSize="md">
              {order?.items.length} Artikel von {customer?.customerName}
            </Span>
            <Span color="gray.500">
              Bestellt {moment(order?.timestamp).format('DD MMM, ddd. h:mm A')}
            </Span>
            <VStack mt={4} />
          </VStack>

          <VStack flex={1} pt={4} px={4} bgColor="white">
            <Span fontSize="lg" fontWeight="medium">
              Bestellübersicht
            </Span>
            <VStack py={4}>
              {order?.items.map(item => (
                <Box py={3}>
                  <HStack key={item.itemId} justifyContent="space-between">
                    <VStack>
                      <Span fontSize="md" fontWeight="medium">
                        {item.quantity}x {item.itemName}
                      </Span>
                      <Span color="gray.400">
                        {item.quantity} {item.itemName} für nur {item.price}
                      </Span>
                    </VStack>
                    <Span fontSize="md">{amount.format(item.price)}</Span>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </VStack>
        </VStack>

        <Box>
          <VStack bgColor="white" p={4} mt={1}>
            <HStack justifyContent="space-between">
              <VStack>
                <Span fontSize="md" fontWeight="medium">
                  Zwischensumme
                </Span>
                <Span color="gray.400">Inklusive Steuern (0.00)</Span>
              </VStack>
              <Span fontSize="md" fontWeight="bold">
                {amount.format(0)}
              </Span>
            </HStack>
          </VStack>

          <VStack bgColor="white" p={4}>
            <HStack justifyContent="space-between" alignItems="center">
              <Span fontSize="md" fontWeight="medium">
                Gesamt
              </Span>
              <Span fontSize="md" fontWeight="bold">
                {amount.format(Number(order?.totalPrice))}
              </Span>
            </HStack>
          </VStack>

          <Box bgColor="white" p={4}>
            <TouchableOpacity
              onPress={() =>
                actions?.handlePressComplete(Number(order?.orderId))
              }>
              <Center p={4} bgColor="#00a4e0" rounded="lg">
                <Span fontWeight="bold" color="white" fontSize="md">
                  Vollständig
                </Span>
              </Center>
            </TouchableOpacity>
          </Box>
        </Box>
      </VStack>
    </SafeAreaView>
  );
}
