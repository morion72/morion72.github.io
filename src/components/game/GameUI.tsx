
"use client";

import type { GameMap } from "@/lib/game-data";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Forward, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import MapView from "./MapView";

type GameUIProps = {
  map: GameMap;
  playerPosition: { x: number; y: number };
  discoveredNotes: Set<number>;
  defeatedEnemies: Set<number>;
  onFinish: () => void;
  allNotesDiscovered: boolean;
  onMove: (dx: number, dy: number) => void;
};

export default function GameUI({
  map,
  playerPosition,
  discoveredNotes,
  defeatedEnemies,
  onFinish,
  allNotesDiscovered,
  onMove
}: GameUIProps) {
  
  return (
    <>
      <Card className="w-full shadow-lg border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-4xl text-primary">Залы Воспоминаний</CardTitle>
          <CardDescription className="text-lg italic">Воспоминания ждут.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4">
          <MapView 
            map={map}
            playerPosition={playerPosition}
            discoveredNotes={discoveredNotes}
            defeatedEnemies={defeatedEnemies}
          />
          <div className="md:hidden flex flex-col items-center gap-2 mt-4">
             <Button onClick={() => onMove(0, -1)} size="icon"><ArrowUp /></Button>
             <div className="flex gap-2">
                <Button onClick={() => onMove(-1, 0)} size="icon"><ArrowLeft /></Button>
                <Button onClick={() => onMove(0, 1)} size="icon"><ArrowDown /></Button>
                <Button onClick={() => onMove(1, 0)} size="icon"><ArrowRight /></Button>
             </div>
          </div>
        </CardContent>
        {allNotesDiscovered && (
          <CardFooter>
            <Button onClick={onFinish} className="w-full text-lg py-6 animate-pulse">
                <Forward className="mr-2" />
                Получить свой дар
            </Button>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
