
"use client";

import { useState, useEffect } from 'react';
import { getPersonalizedMessageAction } from '@/app/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift } from 'lucide-react';

type EndScreenProps = {
  playerName: string;
  explorationProgress: number; // Kept for potential future use, but not used for message generation
  discoveredSecrets: number; // Kept for potential future use, but not used for message generation
};

export default function EndScreen({
  playerName,
}: EndScreenProps) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);
        const result = await getPersonalizedMessageAction({
          playerName,
        });
        if (result.message) {
          setMessage(result.message);
        } else {
          setError('Не удалось создать послание. Духи молчат.');
        }
      } catch (e) {
        setError('Произошла ошибка при связи с духами.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [playerName]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="w-full max-w-2xl text-center shadow-lg shadow-primary/20">
            <CardHeader>
                <div className="mx-auto bg-primary/20 p-4 rounded-full mb-4 w-fit">
                    <Gift className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="font-headline text-3xl">Твой дар</CardTitle>
                <CardDescription>
                    С днем рождения, {playerName}! Путешествие завершено, и свет приносит тебе это послание.
                </CardDescription>
            </CardHeader>
            <CardContent className="min-h-[120px]">
            {loading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
            ) : error ? (
                <p className="text-destructive">{error}</p>
            ) : (
                <p className="text-lg italic text-foreground/90 whitespace-pre-wrap">{message}</p>
            )}
            </CardContent>
        </Card>
    </div>
  );
}
 
