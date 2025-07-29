
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

type IntroProps = {
  onStart: () => void;
};

export default function Intro({ onStart }: IntroProps) {

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md shadow-lg shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full mb-4 w-fit">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl"></CardTitle>
          <CardDescription className="text-muted-foreground">Сегодня твой день рождения! Приготовься отправиться в путешествие по чертогам своей памяти</CardDescription>
        </CardHeader>
        <CardContent>
            <Button onClick={onStart} className="w-full text-lg py-6">Начать</Button>
        </CardContent>
      </Card>
    </div>
  );
}
