'use client';

import React, { useEffect } from 'react';
import NavigationShell from '@/components/NavigationShell';
import InterpretationPage from '@/components/InterpretationPage';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectInterpretationRoute() {
  const { setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('interpretation');
  }, [setActivePage]);

  return (
    <NavigationShell>
      <InterpretationPage />
    </NavigationShell>
  );
}

