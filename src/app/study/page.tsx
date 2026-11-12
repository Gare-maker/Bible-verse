'use client';

import React, { useEffect } from 'react';
import NavigationShell from '@/components/NavigationShell';
import StudyPage from '@/components/StudyPage';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectStudyRoute() {
  const { setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('study');
  }, [setActivePage]);

  return (
    <NavigationShell>
      <StudyPage />
    </NavigationShell>
  );
}

