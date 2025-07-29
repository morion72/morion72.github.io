
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skull } from "lucide-react";

type GameOverScreenProps = {
  onRestart: () => void;
};

export default function GameOverScreen({ onRestart }: GameOverScreenProps) {

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg shadow-destructive/20 text-center">
        <CardHeader>
           <div className="mx-auto bg-destructive/20 p-4 rounded-full mb-4 w-fit">
            <Skull className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="font-headline text-3xl text-destructive">Ты проиграла</CardTitle>
          <CardDescription className="text-muted-foreground">Твоя решимость позволяет тебе попробовать еще раз.</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={onRestart} variant="destructive" className="w-full text-lg py-6">Начать заново</Button>
        </CardContent>
      </Card>
    </div>
  );
}
