import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('preloaderBackground', 'assets/bgblack.png');     
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}

export {Boot as default}
