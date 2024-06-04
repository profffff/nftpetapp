import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(0, 0, 'preloaderBackground').setOrigin(0).setDepth(0);   
    }

    preload ()
    {
        //env
        this.load.setPath('assets');
        this.load.image('nft_default', '/art/pet/petImage/petDefault.png');
        this.load.image('background', 'bg.png');
        this.load.image('star', 'star.png');

        //buttons-actions
        this.load.image('eatIcon', '/art/button/buttonsImage/eatIcon.png');
        this.load.image('medicineIcon', '/art/button/buttonsImage/medicineIcon.png');
        this.load.image('playIcon', '/art/button/buttonsImage/playIcon.png');
        this.load.image('sleepIcon', '/art/button/buttonsImage/sleepIcon.png');
        this.load.image('toiletIcon', '/art/button/buttonsImage/toiletIcon.png');
        this.load.image('drinkIcon', '/art/button/buttonsImage/drinkIcon.png');
        this.load.image('buttonDownIcon', '/art/button/buttonsImage/buttonDownIcon.png');
        this.load.image('claimRewardIcon', '/art/button/buttonsImage/claimAwardButton.png');
        this.load.image('declineRewardIcon', '/art/button/buttonsImage/declineAwardButton.png')
        
        //dialog
        this.load.image('rewardDialog', '/art/dialog/award/nftAwardBackground.png');
        this.load.spritesheet('wantThink', '/art/dialog/wantAnimation/wantAnimationSheet.png',
        { frameWidth: 183, frameHeight: 183 }
        )

        //actions-background
        this.load.image('wrongButtonBackground', '/art/window/wrongButtonBackground/WrgBtnBack.png');
        this.load.image('sleepBackground', '/art/window/sleepBackground/sleepBackground.png');
        this.load.image('increaseMoodBackground', '/art/window/increaseMoodBackground/increaseMoodBackground.png');
        this.load.image('aidBackground', '/art/window/aidButtonBackground/aidBackground.png');

        //animations
        this.load.image('angryMouth', 'art/pet/petMood/Angry/angryMouth.png');
        this.load.image('sadMouth', 'art/pet/petMood/Sad/sadMouth.png');
        
        //timer
        this.load.image('black-layer', '/art/timer/black-layer.png');
        this.load.image('second-layer', '/art/timer/second-layer.png');

        //font
        this.load.bitmapFont('digital-font', '/art/timer/font/digital/digital-7.png', '/art/timer/font/digital/digital-7.xml');
    }

    create ()
    {
        this.scene.start('MainMenu');
    }

    update() {
    }
}

export {Preloader as default}
