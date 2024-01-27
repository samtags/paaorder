import {ReactNode} from 'react';

interface Props {
  condition: boolean;
  children: ReactNode;
}

export default function Optional(props: Props) {
  if (props.condition === false) {
    return null;
  }

  return props.children;
}
