import {Text as Span, HStack, Box, VStack, Image} from 'native-base';
import {TouchableOpacity} from 'react-native';

const Arrow = require('@/assets/png/arrow-right.png');

interface Props {
  onPress: () => unknown;
  title: string;
  customerName: string;
  itemCount: number;
}

export default function Card(props: Props) {
  const {onPress, title, customerName, itemCount} = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Box bgColor="white" px={4} py={2}>
        <HStack alignItems="center" justifyContent="space-between">
          <VStack py={2}>
            <Span fontWeight="medium" fontSize="lg">
              {title}
            </Span>
            <Span color="gray.400">
              {itemCount} items for {customerName}
            </Span>
          </VStack>
          {/* prettier-ignore */}
          <Image h={3.5} w={3.5} resizeMode="contain" source={Arrow} alt="Arrow"/>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
}
