
"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldAlert, Bone, MessageSquare, Smile } from "lucide-react";
import BattleBox from './BattleBox';
import type { Enemy } from '@/lib/game-data';
import { cn } from '@/lib/utils';

type BattleScreenProps = {
  enemy: Enemy;
  onBattleEnd: (didWin: boolean) => void;
  onPlayerDamaged: (damage: number) => void;
  playerHealth: number;
  maxPlayerHealth: number;
};

type BattleState = 'CHOOSING' | 'ENEMY_TURN' | 'CHOOSING_ACT' | 'MERCY' | 'DIALOGUE' | 'PLAYER_ATTACK' | 'BATTLE_VICTORY';

const BATTLE_BUTTON_STYLE = "font-code text-yellow-400 text-2xl hover:bg-yellow-400/20 hover:text-yellow-300 focus:text-yellow-300 focus:bg-yellow-400/20 w-32 h-12 flex items-center justify-start gap-4 px-4";

export default function BattleScreen({ enemy, onBattleEnd, onPlayerDamaged, playerHealth, maxPlayerHealth }: BattleScreenProps) {
  const [battleState, setBattleState] = useState<BattleState>('CHOOSING');
  const [dialogue, setDialogue] = useState('');
  const [canSpare, setCanSpare] = useState(false);
  const [enemyHealth, setEnemyHealth] = useState(enemy.hp);
  const [isEnemyHit, setIsEnemyHit] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const attackBarRef = useRef<HTMLDivElement>(null);
  const attackTimeoutRef = useRef<NodeJS.Timeout>();


  const resetDialogue = () => setDialogue(`* ${enemy.name} смотрит на тебя с любопытством.`);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);
  
  useEffect(() => {
      setEnemyHealth(enemy.hp);
      setBattleState('CHOOSING');
      setDialogue(`* ${enemy.name} появляется перед тобой.`);
      setCanSpare(false);
      setIsEnemyHit(false);

      return () => {
          if(attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
      }
  }, [enemy]);

  const handleAct = () => {
    setBattleState('CHOOSING_ACT');
    setDialogue("* Что же делать?");
  }
  
  const handleCheck = () => {
    setDialogue(enemy.dialogue.check);
    setCanSpare(true); 
    setBattleState('DIALOGUE');
    attackTimeoutRef.current = setTimeout(() => startEnemyTurn(), 4000); 
  }
  
  const handleAttackClick = () => {
      if(attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
      setDialogue('');
      setBattleState('PLAYER_ATTACK');
      attackTimeoutRef.current = setTimeout(() => handleAttack(0), 4000);
  }

  const handleAttack = (damage: number) => {
    if(attackTimeoutRef.current) clearTimeout(attackTimeoutRef.current);
    if(battleState !== 'PLAYER_ATTACK' && battleState !== 'CHOOSING') return;

    const currentHealth = Math.max(0, enemyHealth - damage);
    
    if (damage > 0) {
        setIsEnemyHit(true);
    }
    
    setEnemyHealth(currentHealth);
    
    if (currentHealth <= 0) {
        setBattleState('BATTLE_VICTORY');
        setDialogue(enemy.dialogue.defeat);
        attackTimeoutRef.current = setTimeout(() => {
            onBattleEnd(true);
        }, 3000);
    } else {
        setDialogue(damage > 0 ? `* Ты наносишь ${damage} урона!` : '* Ты промахиваешься.');
        attackTimeoutRef.current = setTimeout(() => {
            setIsEnemyHit(false);
            startEnemyTurn();
        }, 1500);
    }
  };
  
  const stopAttackBar = () => {
      if (!attackBarRef.current || battleState !== 'PLAYER_ATTACK') return;

      const barNode = attackBarRef.current;
      const markerNode = barNode.firstElementChild as HTMLDivElement;
      if(!markerNode) {
          handleAttack(0);
          return;
      }

      const markerStyle = window.getComputedStyle(markerNode);
      const matrix = new WebKitCSSMatrix(markerStyle.transform);
      const markerPos = matrix.m41;
      
      markerNode.style.animationPlayState = 'paused';
      
      const barWidth = barNode.offsetWidth;
      
      const center = barWidth / 2;
      const criticalHitZone = barWidth * 0.05; // 5% of the bar width
      const distance = Math.abs(center - (markerPos + markerNode.offsetWidth / 2));
      
      let damage = 0;
      if (distance < criticalHitZone) { // Critical hit (orange zone)
          damage = 3; 
      } else if (distance < barWidth * 0.4) { // Normal hit (rest of the bar except edges)
          damage = Math.max(1, Math.round(2 * (1 - (distance / (barWidth / 2)))));
      }
      
      handleAttack(damage);
  }


  const handleTalk = () => {
    setDialogue(enemy.dialogue.talk);
    setCanSpare(true);
    setBattleState('DIALOGUE');
    attackTimeoutRef.current = setTimeout(() => startEnemyTurn(), 4000);
  }
  
  const handleMercy = () => {
      setBattleState('MERCY');
      setDialogue("* Твоё милосердие - твоя сила.");
  }

  const handleSpare = () => {
      if (canSpare) {
          setDialogue(enemy.dialogue.spare);
          attackTimeoutRef.current = setTimeout(() => onBattleEnd(true), 2000);
      } else {
          setDialogue(`* ${enemy.name} пока не готов к пощаде.`);
          setBattleState('DIALOGUE');
          attackTimeoutRef.current = setTimeout(() => startEnemyTurn(), 2000);
      }
  }

  const startEnemyTurn = () => {
    setBattleState('ENEMY_TURN');
    setDialogue(`* ${enemy.dialogue.attack}`);
    const turnDuration = enemy.isBoss ? 8000 : 5000;
    attackTimeoutRef.current = setTimeout(() => {
        setBattleState('CHOOSING');
        resetDialogue();
    }, turnDuration); 
  }
  
  const renderAttackBar = () => (
    <div className='w-full h-full flex flex-col items-center justify-center gap-4'>
        <div ref={attackBarRef} className='h-4 w-4/5 bg-gray-700 relative overflow-hidden rounded-full border border-white'>
            <div className='animate-attack-bar absolute top-0 h-full w-2 bg-yellow-400'></div>
             <div className='absolute top-0 h-full bg-primary' style={{left: 'calc(50% - 5%)', width: '10%'}}></div>
        </div>
        <Button onClick={stopAttackBar} className='font-code text-xl'>Удар!</Button>
    </div>
  );

  const renderActionButtons = () => {
    switch (battleState) {
        case 'CHOOSING_ACT':
            return (
                <>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleCheck}><p className='text-white'>* Проверить</p></Button>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleTalk}><p className='text-white'>* Говорить</p></Button>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={() => { setBattleState('CHOOSING'); resetDialogue();}}><p className='text-white'>* Назад</p></Button>
                </>
            );
        case 'MERCY':
            return (
                <>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleSpare}><p className={canSpare ? 'text-yellow-300' : 'text-gray-500'}>* Щадить</p></Button>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={() => onBattleEnd(false)}><p className='text-white'>* Сбежать</p></Button>
                     <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={() => { setBattleState('CHOOSING'); resetDialogue();}}><p className='text-white'>* Назад</p></Button>
                </>
            );
        case 'DIALOGUE':
        case 'ENEMY_TURN':
        case 'PLAYER_ATTACK':
        case 'BATTLE_VICTORY':
            return null;
        default: 
            return (
                <>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleAttackClick}><Bone className="mr-2"/> Атака</Button>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleAct}><MessageSquare className="mr-2"/> Действие</Button>
                    <Button variant="ghost" className={BATTLE_BUTTON_STYLE} onClick={handleMercy}><Smile className="mr-2"/> Пощада</Button>
                </>
            );
    }
  }

  return (
    <div 
        ref={containerRef}
        className="flex flex-col items-center justify-center min-h-[80vh] bg-black text-white p-4 font-code outline-none"
        tabIndex={-1}
        onKeyDown={(e) => {
            if (battleState === 'PLAYER_ATTACK' && (e.key === ' ' || e.key === 'Enter')) {
                e.preventDefault();
                stopAttackBar();
            }
        }}
    >
        <div className="w-full max-w-2xl text-center mb-4 h-24 flex flex-col items-center justify-center">
             {battleState !== 'ENEMY_TURN' && (
                 <div className={cn("transition-transform duration-75", isEnemyHit && "animate-ping-once")}>
                    <ShieldAlert className={cn("h-20 w-20 text-white mx-auto transition-transform duration-500 ease-in-out", isEnemyHit ? "scale-110 -rotate-6" : "scale-100", "animate-ghostly")} />
                 </div>
             )}
            <div className='w-1/2 mt-2'>
                <div className='text-left text-lg'>{enemy.name}</div>
                <div className="w-full h-3 bg-green-900 border border-white flex items-center justify-start">
                    <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(enemyHealth / enemy.maxHp) * 100}%`}}></div>
                </div>
            </div>
        </div>

        <Card className="w-full max-w-2xl h-64 bg-black border-2 border-white mb-4 flex items-center justify-center p-4">
            <CardContent className="w-full h-full p-0">
                {battleState === 'ENEMY_TURN' ? (
                     <BattleBox onPlayerDamaged={onPlayerDamaged} damage={enemy.damage} attackPattern={enemy.attackPattern} />
                ) : battleState === 'PLAYER_ATTACK' ? (
                    renderAttackBar()
                ) : (
                    <div className="flex items-start justify-start h-full text-left">
                        <p className="text-2xl whitespace-pre-wrap">{dialogue}</p>
                    </div>
                )}
            </CardContent>
        </Card>

        <div className="w-full max-w-2xl flex justify-around items-center h-16">
            {renderActionButtons()}
        </div>

        <div className="w-full max-w-2xl flex justify-between items-center text-xl mt-4 px-4">
            <span>Лиза</span>
            <span>УР 1</span>
            <div className="flex items-center gap-2">
                <span>HP</span>
                <div className="w-24 h-6 bg-red-900 border-2 border-white flex items-center justify-start">
                    <div className="h-full bg-yellow-400" style={{ width: `${(playerHealth / maxPlayerHealth) * 100}%`}}></div>
                </div>
                <span>{playerHealth} / {maxPlayerHealth}</span>
            </div>
        </div>
    </div>
  );
}

    
