import { isMediumScreen } from '@/utils/mobile';
import { useEffect, useState } from 'react';

export const useIsTabletScreen = () => {
  const [isTabletScreen, setIsTabletScreen] = useState(isMediumScreen());

  useEffect(() => {
    const resizeListener = () => setIsTabletScreen(isMediumScreen());
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return isTabletScreen;
};
