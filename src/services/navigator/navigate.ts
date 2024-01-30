import {navigationRef} from '@/services/navigator';

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
