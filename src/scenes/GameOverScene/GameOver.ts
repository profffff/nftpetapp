import { EventBus } from '../../game/EventBus';
import { Scene } from 'phaser';

import {petStartAttributes} from '../../values/variables/gameData'

export class GameOver extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText : Phaser.GameObjects.Text;

    constructor ()
    {
        super('GameOver');
    }

    create ()
    {   
        
        this.camera = this.cameras.main
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(512, 384, 'background');
        this.background.setAlpha(0.5);

        this.gameOverText = this.add.text(512, 384, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        


        this.background.setInteractive();    
        this.background.on('pointerdown', () => {
         
        petStartAttributes.mood = 1;
        petStartAttributes.currentAction = null;
        petStartAttributes.actionsDone = 0;

        this.scene.start('Boot');

        //probably better to clear cache..
        //EventBus.emit('restart-game');     
        });
        

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('MainMenu');
    }
}

export {GameOver as default}