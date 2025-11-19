import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/lib/AppContext';

/**
 * 페이지 간 이동 시 스크롤 위치를 저장하고 복원하는 훅
 */
export function usePageScrollRestore() {
  const pathname = usePathname();
  const isRestoredRef = useRef(false);
  
  // useAppContext는 항상 최상위에서 호출되어야 함
  // AppProvider가 layout.tsx에 있으므로 항상 사용 가능해야 함
  const { savePageScrollPosition, restorePageScrollPosition } = useAppContext();

  useEffect(() => {
    // AppContext가 없으면 스크롤 복원 기능 비활성화
    if (!savePageScrollPosition || !restorePageScrollPosition) {
      return;
    }
    
    // 페이지 마운트 시 스크롤 위치 복원
    if (!isRestoredRef.current) {
      try {
        restorePageScrollPosition(pathname);
      } catch (error) {
        console.error('Failed to restore scroll position:', error);
      }
      isRestoredRef.current = true;
    }

    // 스크롤 이벤트 리스너 - 스크롤 위치 저장
    let ticking = false;
    const handleScroll = () => {
      if (!ticking && savePageScrollPosition) {
        window.requestAnimationFrame(() => {
          try {
            const scrollPos = window.scrollY || document.documentElement.scrollTop;
            savePageScrollPosition(pathname, scrollPos);
          } catch (error) {
            console.error('Failed to save scroll position:', error);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // 페이지 언마운트 시 현재 스크롤 위치 저장
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (savePageScrollPosition) {
        try {
          const scrollPos = window.scrollY || document.documentElement.scrollTop;
          savePageScrollPosition(pathname, scrollPos);
        } catch (error) {
          console.error('Failed to save scroll position on unmount:', error);
        }
      }
    };
  }, [pathname, savePageScrollPosition, restorePageScrollPosition]);

  // pathname이 변경되면 복원 플래그 리셋
  useEffect(() => {
    isRestoredRef.current = false;
  }, [pathname]);
}

