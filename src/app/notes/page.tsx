'use client';

import React, { useEffect } from 'react';
import NavigationShell from '@/components/NavigationShell';
import BibleReaderPage from '@/components/BibleReaderPage';
import NotesPage from '@/components/NotesPage';
import { usePlatform } from '@/context/PlatformContext';

export default function DirectNotesRoute() {
  const { activePage, setActivePage } = usePlatform();

  useEffect(() => {
    setActivePage('notes');
  }, [setActivePage]);

  return (
    <NavigationShell>
      {activePage === 'bible' ? <BibleReaderPage /> : <NotesPage />}
    </NavigationShell>
  );
}

