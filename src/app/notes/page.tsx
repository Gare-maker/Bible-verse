'use client';

import React, { useEffect } from 'react';
import NavigationShell from '@/components/NavigationShell';
import NotesPage from '@/components/NotesPage';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectNotesRoute() {
  const { setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('saved');
  }, [setActivePage]);

  return (
    <NavigationShell>
      <NotesPage />
    </NavigationShell>
  );
}

