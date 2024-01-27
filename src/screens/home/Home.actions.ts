import {useNavigation} from '@react-navigation/native';
import {IActions} from '@/services/bit';
import {Order} from '@/services/api/getOrders';

export interface Methods {
  handlePressOrder: (o: Order) => unknown;
}

const AppActions: IActions<Methods> = ({useRegisterActions}) => {
  const navigation = useNavigation();

  function handlePressOrder(order: Order) {
    type Navigate = (screen: string, payload: Order) => unknown;
    const navigate = navigation.navigate as Navigate;

    navigate('Order', order);
  }

  // public methods
  return useRegisterActions({
    handlePressOrder,
  });
};

export default AppActions;
