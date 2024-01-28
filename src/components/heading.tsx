import {Text as Span} from 'native-base';
import Optional from '@/components/optional';

interface Props {
  title: string;
  count: number;
}

export default function Heading(props: Props) {
  return (
    <>
      <Span fontSize="xl" fontWeight="medium" color="#00263e">
        {props.title}
      </Span>
      <Optional condition={Boolean(props.count)}>
        <Span color="gray.400">
          Sie haben ({props.count}) offene Bestellungen
        </Span>
      </Optional>

      <Optional condition={props.count === 0}>
        <Span color="gray.400">
          Alles aufgeholt! Warten auf neue Bestellungen.
        </Span>
      </Optional>
    </>
  );
}
