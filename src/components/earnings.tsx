import {Center, Text as Span} from 'native-base';
import amount from '@/services/utils/formatAmount';

interface Props {
  total: number;
}

export default function Earnings(props: Props) {
  return (
    <Center>
      <Span fontSize="4xl" fontWeight="medium" color="#00263e">
        {amount.format(props.total)}
      </Span>
      <Span color="gray.400" textAlign="center" maxW={280}>
        Dies ist Ihr Umsatz vor Anpassungen und Abzügen
      </Span>
    </Center>
  );
}
