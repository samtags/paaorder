import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef?.();

export {navigate} from './navigate.ts';
export {goBack} from './goBack.ts';
