import {IActions} from '@/services/bit';

interface Methods {
  //
}

const AppActions: IActions<Methods> = ({useRegisterActions}) => {
  console.log('bit actions integrated');

  return useRegisterActions({});
};

export default AppActions;
