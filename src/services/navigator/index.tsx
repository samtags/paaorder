import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef?.();

export type Navigate = (
  name: string,
  payload: {[key: string]: unknown},
) => unknown;

export function navigate(name: string, params: unknown = {}) {
  if (navigationRef?.isReady()) {
    const handleNavigate = navigationRef?.navigate as Navigate;
    handleNavigate(name, params as never);
  }
}

export function goBack() {
  if (navigationRef.isReady()) {
    navigationRef.goBack();
  }
}
