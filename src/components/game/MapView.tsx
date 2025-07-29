
"use client"

import type { GameMap } from "@/lib/game-data";
import { ScrollText, Shield, ShieldAlert } from 'lucide-react';
import { cn } from "@/lib/utils";

type MapViewProps = {
    map: GameMap;
    playerPosition: { x: number; y: number };
    discoveredNotes: Set<number>;
    defeatedEnemies: Set<number>;
};

export default function MapView({ map, playerPosition, discoveredNotes, defeatedEnemies }: MapViewProps) {
  return (
    <div className="bg-card p-2 sm:p-4 rounded-md border border-border">
      <div className="grid grid-cols-19 gap-0.5">
        {map.layout.map((row, y) =>
          row.map((tile, x) => {
            const isPlayerHere = playerPosition.x === x && playerPosition.y === y;
            const note = map.notes.find(n => n.position.x === x && n.position.y === y);
            const isNoteDiscovered = note ? discoveredNotes.has(note.id) : false;
            const enemy = map.enemies.find(e => e.position.x === x && e.position.y === y);
            const isEnemyDefeated = enemy ? defeatedEnemies.has(enemy.id) : false;

            return (
              <div
                key={`${x}-${y}`}
                className={cn(
                  "tile", 
                  tile === 'wall' ? 'tile-wall' : 'tile-floor',
                  "flex items-center justify-center relative"
                )}
              >
                {note && (
                  <ScrollText className={cn(
                      "w-5 h-5 text-yellow-300 absolute", 
                      isNoteDiscovered ? 'note-read' : 'note-pulse'
                  )} />
                )}
                {enemy && !isEnemyDefeated && (
                  <div className="enemy absolute">
                    {enemy.isBoss ? (
                      <ShieldAlert className="w-6 h-6 text-destructive animate-pulse" />
                    ) : (
                      <Shield className="w-5 h-5 text-destructive animate-ghostly" />
                    )}
                  </div>
                )}
                {isPlayerHere && (
                  <div className="player relative" />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
 
