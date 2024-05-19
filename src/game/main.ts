import { Boot } from '../scenes/BootScene/Boot';
import { GameOver } from '../scenes/GameOverScene/GameOver';
import { Game as MainGame } from '../scenes/GameScene/Game';
import { MainMenu } from '../scenes/MainMenuScene/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from '../scenes/PreloaderScene/Preloader';
import { NFTCollectionScene } from '../scenes/NFTCollectionScene/NFTCollectionScene';

import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#028af8',
    
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
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
