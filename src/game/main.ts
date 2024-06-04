import { Boot } from '../scenes/BootScene/Boot';
import { GameOver } from '../scenes/GameOverScene/GameOver';
import { MainMenu } from '../scenes/GameScene/Game';
import { AUTO, Game } from 'phaser';
import { Preloader } from '../scenes/PreloaderScene/Preloader';
import { NFTCollectionScene } from '../scenes/NFTCollectionScene/NFTCollectionScene';
import {gameWindowConfig} from '../values/constants/gameConstants'
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: gameWindowConfig.width,
    height: gameWindowConfig.height,
    parent: 'game-container',
    backgroundColor: '#028af8',
    zoom: 1,
    
    scene: [
        Boot,
        Preloader,
        MainMenu,
        GameOver,
        NFTCollectionScene
    ],

    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: RexUIPlugin,
            mapping: 'rexUI'
        }]
    }
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
