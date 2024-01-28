import {Text as Span, HStack, Box} from 'native-base';
import {TouchableOpacity} from 'react-native';

interface Props {
  value: string | number;
  label: string;
  color?: string;
}

export default function Banner(props: Props) {
  const {value, label, color} = props;

  let bgColor = 'gray.300';

  if (color) {
    bgColor = color;
  }

  return (
    <Box flex={1} flexShrink={0}>
      <TouchableOpacity>
        {/* prettier-ignore */}
        <HStack alignItems="center" justifyContent="center" bgColor={bgColor} rounded="xl" space={3} p={5}>
      <Span fontSize="2xl" fontWeight="bold" color="white">
        {value}
      </Span>
      <Span color="white">{label}</Span>
    </HStack>
      </TouchableOpacity>
    </Box>
  );
}
