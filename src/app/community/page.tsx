'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectCommunityRoute() {
  const router = useRouter();
  const { setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('bible');
    router.replace('/');
  }, [router, setActivePage]);

  return null;
}

