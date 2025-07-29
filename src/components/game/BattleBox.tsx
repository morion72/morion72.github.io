
"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AttackPatternType } from '@/lib/game-data';

const BATTLE_AREA_WIDTH = 200;
const BATTLE_AREA_HEIGHT = 200;
const PLAYER_SPEED = 4;
const PLAYER_SIZE = 16;
const INVINCIBILITY_DURATION = 1500; // 1.5 seconds

type Bullet = {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation?: number;
    update?: (bullet: Bullet, frame: number) => Bullet;
}

type BattleBoxProps = {
    onPlayerDamaged: (damage: number) => void;
    damage: number;
    attackPattern: AttackPatternType;
};

type AttackPatternFn = () => (() => void);

let bulletIdCounter = 0;

export default function BattleBox({ onPlayerDamaged, damage, attackPattern }: BattleBoxProps) {
    const [playerPosition, setPlayerPosition] = useState({ x: BATTLE_AREA_WIDTH / 2 - PLAYER_SIZE / 2, y: BATTLE_AREA_HEIGHT / 2 - PLAYER_SIZE / 2 });
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [isInvincible, setIsInvincible] = useState(false);
    const keysPressed = useRef<Record<string, boolean>>({});
    const containerRef = useRef<HTMLDivElement>(null);
    const lastHitTime = useRef<number>(0);
    const attackIntervalRef = useRef<NodeJS.Timeout>();
    const frameRef = useRef(0);


    const createBullet = useCallback((bullet: Omit<Bullet, 'id'>) => {
        const newId = `bullet-${Date.now()}-${bulletIdCounter++}`;
        setBullets(prev => [...prev, { ...bullet, id: newId }]);
    }, []);

    const attackPatterns: Record<AttackPatternType, AttackPatternFn[]> = {
        shadow: [
             () => {
                const spawner = setInterval(() => {
                    createBullet({
                        x: Math.random() * BATTLE_AREA_WIDTH,
                        y: -10,
                        vx: (Math.random() - 0.5) * 2,
                        vy: 2 + Math.random(),
                        size: 8,
                    });
                }, 300);
                return () => clearInterval(spawner);
            },
             () => {
                let fromLeft = true;
                const spawner = setInterval(() => {
                    for (let i = 0; i < 5; i++) {
                        createBullet({
                            x: fromLeft ? -10 : BATTLE_AREA_WIDTH + 10,
                            y: (i * BATTLE_AREA_HEIGHT / 4) + (Math.random() * 20 - 10),
                            vx: fromLeft ? 2.5 : -2.5,
                            vy: 0,
                            size: 10,
                        });
                    }
                    fromLeft = !fromLeft;
                }, 1000);
                return () => clearInterval(spawner);
            }
        ],
        echo: [
            () => {
                let angle = Math.random() * Math.PI * 2;
                const spawner = setInterval(() => {
                    angle += 0.8; // Spin faster
                     for (let i = 0; i < 2; i++) {
                        const speed = 2;
                        createBullet({
                            x: BATTLE_AREA_WIDTH / 2,
                            y: BATTLE_AREA_HEIGHT / 2,
                            vx: Math.cos(angle + i * Math.PI) * speed,
                            vy: Math.sin(angle + i * Math.PI) * speed,
                            size: 7,
                        });
                    }
                }, 100);
                return () => clearInterval(spawner);
            },
             () => {
                const spawner = setInterval(() => {
                    const targetX = playerPosition.x;
                    for(let i = 0; i < 3; i++) {
                         setTimeout(() => {
                            createBullet({
                                x: targetX + (Math.random() * 40 - 20),
                                y: -10,
                                vx: 0,
                                vy: 3,
                                size: 9,
                            });
                         }, i * 150)
                    }
                }, 1000);
                return () => clearInterval(spawner);
            }
        ],
        guardian: [
             () => {
                const spawner = setInterval(() => {
                    const angleStep = Math.PI / 8;
                    for (let i = 0; i < 16; i++) {
                        const angle = i * angleStep;
                        createBullet({
                            x: BATTLE_AREA_WIDTH / 2,
                            y: BATTLE_AREA_HEIGHT / 2,
                            vx: Math.cos(angle) * 3.5,
                            vy: Math.sin(angle) * 3.5,
                            size: 6,
                        });
                    }
                }, 900);
                return () => clearInterval(spawner);
            },
             () => {
                 const spawner = setInterval(() => {
                    createBullet({
                        x: Math.random() > 0.5 ? -10 : BATTLE_AREA_WIDTH + 10,
                        y: Math.random() * BATTLE_AREA_HEIGHT,
                        vx: 0,
                        vy: 0,
                        size: 12,
                        update: (b) => {
                            const dx = playerPosition.x - b.x;
                            const dy = playerPosition.y - b.y;
                            const angle = Math.atan2(dy, dx);
                            const speed = 1.5;
                            return {...b, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed };
                        }
                    });
                }, 1200);
                return () => clearInterval(spawner);
            },
             () => {
                const spawner = setInterval(() => {
                    const isVertical = Math.random() > 0.5;
                    const linePos = Math.random() * (isVertical ? BATTLE_AREA_WIDTH : BATTLE_AREA_HEIGHT);
                    for(let i = 0; i < 20; i++) {
                         createBullet({
                            x: isVertical ? linePos : i * (BATTLE_AREA_WIDTH/20),
                            y: isVertical ? i * (BATTLE_AREA_HEIGHT/20) : linePos,
                            vx: 0,
                            vy: 0,
                            size: 10,
                        });
                    }
                }, 1500);
                 return () => clearInterval(spawner);
            },
             () => {
                let angle = 0;
                const spawner = setInterval(() => {
                    angle += 0.5; // Controls rotation speed of the spiral
                    const speed = 2.5;
                    createBullet({
                        x: BATTLE_AREA_WIDTH / 2,
                        y: BATTLE_AREA_HEIGHT / 2,
                        vx: Math.cos(angle) * speed,
                        vy: Math.sin(angle) * speed,
                        size: 8,
                    });
                }, 50); // Spawns bullets very quickly
                return () => clearInterval(spawner);
            },
             () => {
                const spawner = setInterval(() => {
                    const targetX = playerPosition.x;
                    const targetY = playerPosition.y;

                    for (let i = 0; i < 5; i++) {
                        setTimeout(() => {
                            const dx = targetX - (BATTLE_AREA_WIDTH / 2);
                            const dy = targetY - (BATTLE_AREA_HEIGHT / 2);
                            const angle = Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.4; // Add some spread
                            const speed = 4;
                             createBullet({
                                x: BATTLE_AREA_WIDTH / 2,
                                y: BATTLE_AREA_HEIGHT / 2,
                                vx: Math.cos(angle) * speed,
                                vy: Math.sin(angle) * speed,
                                size: 7,
                            });
                        }, i * 80);
                    }
                }, 1000);
                return () => clearInterval(spawner);
            },
             () => {
                let frame = 0;
                const spawner = setInterval(() => {
                    frame++;
                    const speed = 3;
                    // Vertical wave from top
                    createBullet({
                        x: (BATTLE_AREA_WIDTH / 2) + Math.sin(frame * 0.1) * (BATTLE_AREA_WIDTH/2.5),
                        y: -10,
                        vx: 0,
                        vy: speed,
                        size: 10
                    });
                    // Horizontal wave from right
                     createBullet({
                        x: BATTLE_AREA_WIDTH + 10,
                        y: (BATTLE_AREA_HEIGHT / 2) + Math.cos(frame * 0.1) * (BATTLE_AREA_HEIGHT/2.5),
                        vx: -speed,
                        vy: 0,
                        size: 10
                    });
                }, 100);
                return () => clearInterval(spawner);
            }
        ]
    }
    
    // Game loop
    useEffect(() => {
        const gameLoop = setInterval(() => {
            frameRef.current++;
            // Move player
            setPlayerPosition(prev => {
                let { x, y } = prev;
                if (keysPressed.current['arrowup'] || keysPressed.current['w'] || keysPressed.current['ц']) y -= PLAYER_SPEED;
                if (keysPressed.current['arrowdown'] || keysPressed.current['s'] || keysPressed.current['ы']) y += PLAYER_SPEED;
                if (keysPressed.current['arrowleft'] || keysPressed.current['a'] || keysPressed.current['ф']) x -= PLAYER_SPEED;
                if (keysPressed.current['arrowright'] || keysPressed.current['d'] || keysPressed.current['в']) x += PLAYER_SPEED;

                // Clamp position within bounds
                x = Math.max(0, Math.min(x, BATTLE_AREA_WIDTH - PLAYER_SIZE));
                y = Math.max(0, Math.min(y, BATTLE_AREA_HEIGHT - PLAYER_SIZE));

                return { x, y };
            });
            
            // Move bullets
            setBullets(prevBullets => prevBullets.map(b => {
                 const updatedBullet = b.update ? b.update(b, frameRef.current) : b;
                 return {
                    ...updatedBullet,
                    x: updatedBullet.x + updatedBullet.vx,
                    y: updatedBullet.y + updatedBullet.vy,
                 }
            }).filter(b => 
                b.x > -b.size - 20 && b.x < BATTLE_AREA_WIDTH + b.size + 20 &&
                b.y > -b.size - 20 && b.y < BATTLE_AREA_HEIGHT + b.size + 20
            ));
            
            // Collision detection
            const now = Date.now();
            if (now - lastHitTime.current > INVINCIBILITY_DURATION) {
                if (isInvincible) setIsInvincible(false);

                for (const bullet of bullets) {
                    const dx = playerPosition.x + PLAYER_SIZE / 2 - (bullet.x + bullet.size / 2);
                    const dy = playerPosition.y + PLAYER_SIZE / 2 - (bullet.y + bullet.size / 2);
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < PLAYER_SIZE / 2 + bullet.size / 2) {
                        onPlayerDamaged(damage);
                        setIsInvincible(true);
                        lastHitTime.current = now;
                        break;
                    }
                }
            }


        }, 1000 / 60); // 60 FPS

        return () => clearInterval(gameLoop);
    }, [bullets, playerPosition, onPlayerDamaged, isInvincible, damage]);


    // Keyboard input & Attack Spawner
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = true; };
        const handleKeyUp = (e: KeyboardEvent) => { keysPressed.current[e.key.toLowerCase()] = false; };
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        const activePatterns = attackPatterns[attackPattern] || attackPatterns.shadow;
        let clearCurrentPattern: (() => void) | null = null;

        const startRandomPattern = () => {
            if (clearCurrentPattern) clearCurrentPattern();
            const pattern = activePatterns[Math.floor(Math.random() * activePatterns.length)];
            clearCurrentPattern = pattern();
        };

        startRandomPattern();
        
        const patternInterval = attackPattern === 'guardian' ? 4000 : 5000;
        attackIntervalRef.current = setInterval(startRandomPattern, patternInterval);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (attackIntervalRef.current) clearInterval(attackIntervalRef.current);
            if(clearCurrentPattern) clearCurrentPattern();
        };
    }, [attackPattern, createBullet]);


    return (
        <div 
            ref={containerRef}
            className="relative bg-black border-2 border-white mx-auto overflow-hidden"
            style={{ width: BATTLE_AREA_WIDTH, height: BATTLE_AREA_HEIGHT }}
        >
            <div 
                className={cn(
                    "player-soul",
                    isInvincible && "animate-flicker"
                )}
                style={{
                    left: `${playerPosition.x}px`,
                    top: `${playerPosition.y}px`,
                    width: `${PLAYER_SIZE}px`,
                    height: `${PLAYER_SIZE}px`,
                }}
            >
                <Heart className="w-full h-full text-red-500 fill-current" />
            </div>

            {bullets.map(bullet => (
                <div 
                    key={bullet.id}
                    className="bullet"
                    style={{
                        left: `${bullet.x}px`,
                        top: `${bullet.y}px`,
                        width: `${bullet.size}px`,
                        height: `${bullet.size}px`,
                    }}
                />
            ))}
        </div>
    );
}
 
