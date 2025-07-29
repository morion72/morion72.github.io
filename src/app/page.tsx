
"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import type { Note, Enemy } from '@/lib/game-data';
import { gameMap } from '@/lib/game-data';
import Intro from '@/components/game/Intro';
import GameUI from '@/components/game/GameUI';
import EndScreen from '@/components/game/EndScreen';
import BattleScreen from '@/components/game/BattleScreen';
import GameOverScreen from '@/components/game/GameOverScreen';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type GameState = 'intro' | 'playing' | 'battle' | 'finished' | 'gameover';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [playerName, setPlayerName] = useState('Лиза');
  const [discoveredNotes, setDiscoveredNotes] = useState<Set<number>>(new Set());
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [defeatedEnemies, setDefeatedEnemies] = useState<Set<number>>(new Set());

  // Player state
  const [playerPosition, setPlayerPosition] = useState(gameMap.playerStart);
  const [playerHealth, setPlayerHealth] = useState(20);
  const [maxPlayerHealth] = useState(20);

  const resetGame = () => {
    setGameState('intro');
    setPlayerName('Лиза');
    setDiscoveredNotes(new Set());
    setSelectedNote(null);
    setCurrentEnemy(null);
    setDefeatedEnemies(new Set());
    setPlayerPosition(gameMap.playerStart);
    setPlayerHealth(maxPlayerHealth);
  };


  const handleStartGame = () => {
    setGameState('playing');
  };

  const handleDiscoverNote = useCallback((noteId: number) => {
    if (!discoveredNotes.has(noteId)) {
      setDiscoveredNotes(prev => new Set(prev).add(noteId));
      const note = gameMap.notes.find(n => n.id === noteId);
      setSelectedNote(note || null);
    }
  }, [discoveredNotes]);

  const handleEncounterEnemy = useCallback((enemy: Enemy) => {
    if (defeatedEnemies.has(enemy.id)) return;
    setCurrentEnemy(enemy);
    setGameState('battle');
  }, [defeatedEnemies]);

  const handleFinishGame = () => {
    setGameState('finished');
  };

  const handlePlayerDamaged = useCallback((damage: number) => {
    setPlayerHealth(prev => {
        const newHealth = Math.max(0, prev - damage);
        if (newHealth <= 0) {
            setGameState('gameover');
        }
        return newHealth;
    });
  }, []);
  
  const handleEndBattle = useCallback((didWin: boolean) => {
    if (didWin && currentEnemy) {
        setDefeatedEnemies(prev => new Set(prev).add(currentEnemy.id));
    }
    // Reset health to full after every battle
    setPlayerHealth(maxPlayerHealth);
    setGameState('playing');
    setCurrentEnemy(null);
  }, [currentEnemy, maxPlayerHealth]);

  const movePlayer = useCallback((dx: number, dy: number) => {
    const newX = playerPosition.x + dx;
    const newY = playerPosition.y + dy;

    if (
      newY >= 0 && newY < gameMap.layout.length &&
      newX >= 0 && newX < gameMap.layout[newY].length &&
      gameMap.layout[newY][newX] !== 'wall'
    ) {
      setPlayerPosition({ x: newX, y: newY });
      
      const noteAtNewPosition = gameMap.notes.find(
        note => note.position.x === newX && note.position.y === newY
      );
      if (noteAtNewPosition) {
        handleDiscoverNote(noteAtNewPosition.id);
      }

      const enemyAtNewPosition = gameMap.enemies.find(
        enemy => enemy.position.x === newX && enemy.position.y === newY
      );
      if (enemyAtNewPosition && !defeatedEnemies.has(enemyAtNewPosition.id)) {
        handleEncounterEnemy(enemyAtNewPosition);
      }
    }
  }, [playerPosition, handleDiscoverNote, handleEncounterEnemy, defeatedEnemies]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      e.preventDefault(); // Prevent default browser actions for arrow keys
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
        case 'ц':
          movePlayer(0, -1);
          break;
        case 'arrowdown':
        case 's':
        case 'ы':
          movePlayer(0, 1);
          break;
        case 'arrowleft':
        case 'a':
        case 'ф':
          movePlayer(-1, 0);
          break;
        case 'arrowright':
        case 'd':
        case 'в':
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, movePlayer]);

  const explorationProgress = useMemo(() => {
    return Math.round((discoveredNotes.size / gameMap.notes.length) * 100);
  }, [discoveredNotes]);
  
  const allNotesDiscovered = useMemo(() => discoveredNotes.size === gameMap.notes.length, [discoveredNotes]);

  const renderGameState = () => {
    switch (gameState) {
      case 'intro':
        return <Intro onStart={handleStartGame} />;
      case 'playing':
        return (
          <GameUI
            map={gameMap}
            playerPosition={playerPosition}
            discoveredNotes={discoveredNotes}
            defeatedEnemies={defeatedEnemies}
            onFinish={handleFinishGame}
            allNotesDiscovered={allNotesDiscovered}
            onMove={movePlayer}
          />
        );
       case 'battle':
        if (!currentEnemy) return null;
        return (
            <BattleScreen 
                enemy={currentEnemy}
                onBattleEnd={handleEndBattle}
                onPlayerDamaged={handlePlayerDamaged}
                playerHealth={playerHealth}
                maxPlayerHealth={maxPlayerHealth}
            />
        );
      case 'finished':
        return (
          <EndScreen 
            playerName={playerName}
            explorationProgress={explorationProgress}
            discoveredSecrets={discoveredNotes.size}
          />
        );
      case 'gameover':
          return <GameOverScreen onRestart={resetGame} />;
      default:
        return null;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-12 bg-background">
      <div className="w-full max-w-4xl mx-auto">
        {renderGameState()}
      </div>
      <Dialog open={!!selectedNote} onOpenChange={() => setSelectedNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-primary font-headline text-2xl">{selectedNote?.title}</DialogTitle>
            <DialogDescription className="text-base pt-4 whitespace-pre-wrap">{selectedNote?.content}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </main>
  );
}
 
