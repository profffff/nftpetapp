import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../../game/EventBus';

import { INFT } from '@/types'

import {Pet} from '../../entities/pet'

import {Animations} from '../../entities/animations'

import * as Constant from '../../values/constants/gameConstants'

import Button from '../../components/buttons/gameButton'

import Timer from '../../components/timer/gameTimer'
import {sceneManager} from '@/src/entities/sceneManager';

import Actions from '../../entities/actions'



export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    text1: GameObjects.Text;
    playerImage: string;

    private timerAwaiting: number | null = null;

    private pet?: Pet;
    private timer?: Timer;
    private actions?: Actions;

    handleKeyValue: (key: string) => void;



    constructor ()
    {
        super({key: 'MainMenu'});

        
    }

    init(choosenPlayerImage: string)   
     {
        this.playerImage = choosenPlayerImage;
     }

    preload()
    {
        
    }

    

    create ()
    {      
        this.add.image(0, 0, 'background').setOrigin(0).setDepth(0);
        
       if (!this.textures.exists(this.playerImage)) {
            this.playerImage = 'nft_default';
        }

        this.pet = new Pet(this, Constant.petImage.imagePositionX, Constant.petImage.imagePositionY, this.playerImage, Constant.petImage.imageScale);
        this.pet.moodAnimation();
        
        this.title = this.add.text(910, 50, 'NFT PET', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(10);

        this.add.text(605, 7, 'Reward after actions = 10 && mood > 8 v0.02', {
            color: '#000000', align: 'center'
        }).setDepth(10);

       //this.pet.playWantsAnimation()
        this.timer = new Timer(this, Constant.timerIcon.timerPositionX, Constant.timerIcon.timerPositionY, sceneManager.prevTimerTime !== 0 ? sceneManager.prevTimerTime : undefined);
        

        if (sceneManager.animationPlayed)
            this.pet.playWantsAnimation();

        //to do: 
        const playButton = new Button(this, 'playAction', 1 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "playIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)
            

        const eatButton = new Button(this, 'eatAction', 2 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "eatIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)

        const toiletButton = new Button(this, 'toiletAction', 3 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "toiletIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)

        const drinkButton = new Button(this, 'drinkAction', 4 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "drinkIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)

        const sleepButton = new Button(this, 'sleepAction', 5 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "sleepIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)
            
        const medicineButton = new Button(this, 'medicineAction', 6 * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, "medicineIcon", 0xFFAD00)
			.setDownTexture('buttonDownIcon')
			.setOverTint(0xffcd60)
            .setScale(Constant.buttonIcons.iconScale)
     
    
        this.add.existing(eatButton)
        this.add.existing(drinkButton)
        this.add.existing(medicineButton)
        this.add.existing(playButton)
        this.add.existing(sleepButton)
        this.add.existing(toiletButton)

        this.handleKeyValue = (key) => {
            console.log('Choosen Button:', key);
            this.actions = new Actions(key, this.timer);     
            const isPressedButtonCorrect = this.actions.getIsCorrectButton();
            console.log('getIsCorrectButton', isPressedButtonCorrect);
            this.pet.moodAnimation();
            if (isPressedButtonCorrect) {
                this.pet.stopWantsAnimation();
                sceneManager.setAnimationPlayed(false);
                if (this.actions?.getBackgroundManager()) {
                    const crtDelay = this.actions.getCrtDelay();
                    this.pet.showBackground(this.actions.getBackgroundManager(), crtDelay);
                }
            }
            else {
                if (this.timer.getCurrentSeconds() === 0) {
                    this.pet.showWrongButtonBackground();
                }
            }
        };

        eatButton.setKeyValueCallback(this.handleKeyValue);
        drinkButton.setKeyValueCallback(this.handleKeyValue);
        medicineButton.setKeyValueCallback(this.handleKeyValue);
        playButton.setKeyValueCallback(this.handleKeyValue);
        sleepButton.setKeyValueCallback(this.handleKeyValue);
        toiletButton.setKeyValueCallback(this.handleKeyValue);

        
        this.events.on('timerFinished', this.handleTimerFinished, this);
       
      
        EventBus.emit('current-scene-ready', this);
        EventBus.on('gameOver', () => {
            this.scene.start('GameOver');
        });
   
    }

    handleTimerFinished() {
        console.log('Timer finished!'); 
        console.log(this.actions)
        this.pet.playWantsAnimation()
        this.timerAwaiting = this.scene.scene.time.now;
    }


    update(time: number, delta: number): void
    {

    }
    



    loadNFTCollectionScene(nftArray: { tokenId: string | undefined; image: string | undefined; name: string | undefined }[])
    {
        sceneManager.setSeconds(this.timer.getCurrentSeconds())
        
        if (this.pet.isPlayingWantsAnimation())
            sceneManager.setAnimationPlayed(true)

        console.log(nftArray);
        this.scene.start('NFTCollectionScene', {nftArray: nftArray});

        
    }

}

export {MainMenu as default}