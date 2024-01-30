import {navigationRef} from '@/services/navigator';

export function goBack() {
  if (navigationRef?.isReady()) {
    navigationRef.goBack();
  }
}
