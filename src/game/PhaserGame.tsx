// bridge between React and Phaser

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import StartGame from './main';
import { EventBus } from './EventBus';

export interface IRefPhaserGame
{
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}

interface IProps
{
    MintNFTActive?: (value: boolean) => void;
    currentActiveScene?: (scene_instance: Phaser.Scene) => void;
    
}

export const PhaserGame = forwardRef<IRefPhaserGame, IProps>(function PhaserGame(
    { MintNFTActive, currentActiveScene
 }, ref)
{
    const game = useRef<Phaser.Game | null>(null!);

    useLayoutEffect(() =>
    {
        if (game.current === null)
            {
    
                game.current = StartGame("game-container");
               
    
                if (typeof ref === 'function')
                {
                    ref({ game: game.current, scene: null });
                } else if (ref)
                {
                    ref.current = { game: game.current, scene: null };
                }
    
            }
    
        return () =>
        {
            if (game.current)
            {
                game.current.destroy(true);
                if (game.current !== null)
                {
                    game.current = null;
                }
            }
        }
    }, [ref]);

    useEffect(() =>
    {
        EventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) =>
        {
            if (currentActiveScene && typeof currentActiveScene === 'function')
            {

                currentActiveScene(scene_instance);

            }

            if (typeof ref === 'function')
            {
                ref({ game: game.current, scene: scene_instance });
            } else if (ref)
            {
                ref.current = { game: game.current, scene: scene_instance };
            }
 
        });


        EventBus.on('mintNFT', () => {
            console.log('Player won1!');
            MintNFTActive(true);     
        });


        return () =>
        {
            EventBus.removeListener('current-scene-ready');
        }
    }, [currentActiveScene, ref]);


    return (
        <div id="game-container"></div>
    );





    


});

export { PhaserGame as default  };
export type { IRefPhaserGame as interface};
