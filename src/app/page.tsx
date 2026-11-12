'use client';

import React from 'react';
import NavigationShell from '@/components/NavigationShell';
import BibleReaderPage from '@/components/BibleReaderPage';
import NotesPage from '@/components/NotesPage';
import StudyPage from '@/components/StudyPage';
import { usePlatform } from '@/context/PlatformContext';

export default function HomePage() {
  const { activePage } = usePlatform();

  return (
    <NavigationShell>
      {activePage === 'bible' ? (
        <BibleReaderPage />
      ) : activePage === 'study' || activePage === 'interpretation' ? (
        <StudyPage />
      ) : (
        <NotesPage />
      )}
    </NavigationShell>
  );
}

