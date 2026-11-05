import { NextRequest, NextResponse } from 'next/server';
import {
  generateAIExplanationForConnection,
  generateAIExplanationForSingleVerse,
  generateFollowUpResponse,
} from '@/data/aiExplanations';
import { TranslationId } from '@/types/bible';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      mode,
      primaryRef,
      connectedRef,
      translation = 'NIV',
      question,
    }: {
      mode: 'connection' | 'verse' | 'followup';
      primaryRef: string;
      connectedRef?: string;
      translation?: TranslationId;
      question?: string;
    } = body;

    if (!primaryRef || typeof primaryRef !== 'string') {
      return NextResponse.json(
        { error: 'A valid primary scripture reference is required.' },
        { status: 400 }
      );
    }

    if (mode === 'followup' && question) {
      const reply = generateFollowUpResponse(question, primaryRef, connectedRef, translation);
      return NextResponse.json({ result: reply });
    }

    if (mode === 'connection' && connectedRef) {
      const explanation = generateAIExplanationForConnection(
        primaryRef,
        connectedRef,
        translation
      );
      return NextResponse.json({ explanation });
    }

    const verseExplanation = generateAIExplanationForSingleVerse(primaryRef, translation);
    return NextResponse.json({ explanation: verseExplanation });
  } catch (err) {
    console.error('AI Research Engine error:', err);
    return NextResponse.json(
      { error: 'Failed to process AI scripture research request.' },
      { status: 500 }
    );
  }
}

