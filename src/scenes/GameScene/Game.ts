import { GameObjects, Scene } from 'phaser';
import { EventBus } from '../../game/EventBus';

import * as Constant from '../../values/constants/gameConstants'

import Button from '../../components/buttons/gameButton'
import Timer from '../../components/timer/gameTimer'

import {sceneManager} from '@/src/entities/sceneManager';

import Actions from '../../entities/actions'
import {Pet} from '../../entities/pet'


export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;
    text1: GameObjects.Text;
    playerImage: string;

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

        this.add.text(605, 7, 'Reward after actions = 10 && mood > 8 v0.03', {
            color: '#000000', align: 'center'
        }).setDepth(10);

        this.timer = new Timer(this, Constant.timerIcon.timerPositionX, Constant.timerIcon.timerPositionY, sceneManager.prevTimerTime !== 0 ? sceneManager.prevTimerTime : undefined);
        
        if (sceneManager.animationPlayed) {
            this.pet.playWantsAnimation();
            this.actions?.setWaitingTimer();
        }

        this.handleKeyValue = (key) => {     
            this.actions?.removeWaitingTImers();
            this.actions = new Actions(key, this.timer);           
            const isPressedButtonCorrect = this.actions.getIsCorrectButton();
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

        const buttons = [
            { name: 'playAction', texture: 'playIcon', number: 1 },
            { name: 'eatAction', texture: 'eatIcon', number: 2 },
            { name: 'toiletAction', texture: 'toiletIcon', number: 3 },
            { name: 'drinkAction', texture: 'drinkIcon', number: 4 },
            { name: 'sleepAction', texture: 'sleepIcon', number: 5 },
            { name: 'medicineAction', texture: 'medicineIcon', number: 6 }
          ];
          
          const createButton = (button) => {
            return new Button(this, button.name, button.number * Constant.buttonIcons.iconPositionX, Constant.buttonIcons.iconPositionY, button.texture, 0xFFAD00)
              .setDownTexture('buttonDownIcon')
              .setOverTint(0xffcd60)
              .setScale(Constant.buttonIcons.iconScale);
          };
     
          const addButtons = () => {
            buttons.forEach(button => {
              const btn = createButton(button);
              this.add.existing(btn);
              btn.setKeyValueCallback(this.handleKeyValue);
            });
          };

        addButtons();
    
        this.events.on('timerFinished', this.handleTimerFinished, this);

        this.events.on('penaltyTimerFinished', this.handlePenaltyTimerFinished, this);
       
        EventBus.emit('current-scene-ready', this);

        EventBus.on('gameOver', () => {
            this.scene.start('GameOver');
        });
   
    }

    handleTimerFinished() {
        this.pet?.playWantsAnimation()
        this.actions?.setWaitingTimer();
    }


    handlePenaltyTimerFinished() {
        this.actions?.decreaseMood(); 
        this.pet?.moodAnimation();
        this.actions?.setWaitingTimer();
    }


    update(time: number, delta: number): void
    {

    }

    loadNFTCollectionScene(nftArray: { tokenId: string | undefined; image: string | undefined; name: string | undefined }[])
    {
        sceneManager.setSeconds(this.timer.getCurrentSeconds())
        
        if (this.pet.isPlayingWantsAnimation())
            sceneManager.setAnimationPlayed(true)

        this.scene.start('NFTCollectionScene', {nftArray: nftArray});      
    }

}

export {MainMenu as default}