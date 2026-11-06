'use client';

import React, { useEffect } from 'react';
import NavigationShell from '@/components/NavigationShell';
import CommunityPage from '@/components/CommunityPage';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectCommunityRoute() {
  const { setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('community');
  }, [setActivePage]);

  return (
    <NavigationShell>
      <CommunityPage />
    </NavigationShell>
  );
}

