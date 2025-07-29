
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Gift } from 'lucide-react';

// ВАЖНО: Отредактируйте этот текст, чтобы написать свое собственное поздравление!
const personalizedMessage = `С днем рождения, Лиза!\n\nИтак, я не слишком знаю что говорить.\n Поздравляю тебя, желаю оставаться такой же умной, милой и классной)`;


type EndScreenProps = {
  playerName: string;
  explorationProgress: number; 
  discoveredSecrets: number; 
};

export default function EndScreen({
  playerName,
}: EndScreenProps) {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Теперь мы просто используем переменную из этого же файла
      setMessage(personalizedMessage.replace('${playerName}', playerName));
    } catch (e) {
      setError('Произошла ошибка при загрузке послания.');
    } finally {
      setLoading(false);
    }
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
