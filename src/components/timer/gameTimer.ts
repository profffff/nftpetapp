import Phaser from 'phaser'

const timerDigitsColor = 0x000000
const redColor = 0xFF0000
const yellowColor = 0xFEB051

import {
    actionsDelay
} from '../../values/constants/gameConstants'

export default class Timer {
    private scene: Phaser.Scene;
    blackLayer: Phaser.GameObjects.Sprite;
    secondLayer: Phaser.GameObjects.Sprite;
    shape: Phaser.GameObjects.Graphics;
    mask: Phaser.Display.Masks.GeometryMask;
    seconds: number;
    timerText: Phaser.GameObjects.BitmapText;
    timeEvent: Phaser.Types.Time.TimerEventConfig;
    counter: Phaser.Tweens.Tween | null;
    warningMessage: Phaser.GameObjects.BitmapText;
    warningMessageTween: Phaser.Tweens.Tween | null;
    waitingTimer: Phaser.Time.TimerEvent  | null ;

    posX: number;
    posY: number;

    constructor(scene: Phaser.Scene, x: number, y: number, startTime?: number ) {
        this.scene = scene;
        this.posX = x;
        this.posY = y;

        this.blackLayer = this.scene.add.sprite(x, y, 'black-layer');
        this.secondLayer = this.scene.add.sprite(x, y, 'second-layer');

        this.shape = this.scene.make.graphics();
        this.shape.fillStyle(0xffffff);
        this.shape.slice(this.secondLayer.x, this.secondLayer.y, this.secondLayer.displayWidth / 2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(0), true);
        this.shape.fillPath();

        this.mask = this.shape.createGeometryMask();
        this.secondLayer.setMask(this.mask);

        this.seconds = startTime ? startTime : 0;

        this.timerText = this.scene.add.bitmapText(x, y, 'digital-font', this.seconds.toString()).setScale(1.5).setOrigin(0.5);
        this.timerText.setTint(timerDigitsColor); //0xFE0101 red

       

       this.timeEvent = scene.time.addEvent({
            delay: 1000,                
            callback: this.timeEventCallback,
            callbackScope: this,
            repeat: -1
            });

        if (startTime) {
            this.start(this.seconds);
            }
        else {
            this.timeEvent.paused = true;
        }
    }   

    timeEventCallback(){
        this.seconds--;
        this.timerText.setText(this.seconds.toString());
        if(this.seconds === 0) {
            this.timeEvent.paused = true;
            this.shape.clear();
            this.scene.events.emit('timerFinished');
        }
    }

    start(seconds) {
        this.timeEvent.paused = false;
        this.seconds = seconds;
        this.timerText.setText(this.seconds.toString()); 
        this.counter = this.scene.tweens.addCounter({
            from: 0,
            to: 359,
            duration: this.seconds * 1000,
            onUpdate: (tween) => {
                let t = tween.getValue();
                this.shape.clear();
                this.shape.slice(this.secondLayer.x, this.secondLayer.y, this.secondLayer.displayWidth / 2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(270 + t), true);
                this.shape.fillPath();
            }
        });
    }
    pause(){
        this.timeEvent.paused = true;
        this.counter.pause();
    }
    resume(){
        this.timeEvent.paused = false;
        this.counter.resume();
    }
    
    scaleTweenWarning(){
        this.scene.tweens.add({
            targets: this.timerText,
            scaleX: [1.5, 3], 
            scaleY: [1.5, 3],  
            duration: 1000,
            ease: 'Linear', 
            repeat: 0, 
            yoyo: true, 
            onActive: () => {
                this.timerText.setTint(redColor);
            },
            onComplete: () => {
                this.timerText.setTint(timerDigitsColor);
            }        
        });
        
    }

    getCurrentSeconds(): number {
        return this.seconds;
    }


    liteTimer() {   
        this.waitingTimer = this.scene.time.addEvent({
            delay: actionsDelay.waitingTimeForActionLite * 1000,               
            callback: this.liteTimerCompleted,
            callbackScope: this,
            loop: false
        });
        
    }

    liteTimerCompleted() {
        this.warningTimer();
    }

    warningTimer() {
        this.waitingTimer = this.scene.time.addEvent({
            delay: actionsDelay.waitingTimeForActionWarning * 1000,              
            callback: this.warningTimerCompleted,
            callbackScope: this,
            loop: false
        });
    }

    warningTimerCompleted() {
        this.warningMessage = this.scene.add.bitmapText( this.posX + 130, this.posY - 50, 'digital-font', 'Don\'t keep the pet waiting!');
        this.warningMessage.setTint(yellowColor);

        this.showWarningMessage();

        this.penaltyTimer();
    }
    
    showWarningMessage(repeatTimes: number = -1){     
        this.warningMessageTween = this.scene.tweens.add({
            targets: this.warningMessage,
            scaleX: [1, 1.3], 
            scaleY: [1, 1.3], 
            duration: 1000,
            ease: 'Linear', 
            repeat: repeatTimes, 
            alpha: 0.7,
            yoyo: true,       
            onComplete: () => {
                this.warningMessage.destroy();
                this.warningMessageTween.destroy();
            }        
        });
    }

    penaltyTimer() {
        this.waitingTimer = this.scene.time.addEvent({
            delay: actionsDelay.waitingTimeForActionPenalty * 1000,            
            callback: this.penaltyTimerCompleted,
            callbackScope: this,
            loop: false,
        });
    }



    penaltyTimerCompleted() {
        console.log(this.waitingTimer)
        this.scene.events.emit('penaltyTimerFinished');
        if (this.warningMessage)
            this.warningMessage.destroy();
        this.warningMessage = this.scene.add.bitmapText(this.posX + 130, this.posY - 50, 'digital-font', 'Toooo long!');
        this.warningMessage.setTint(redColor);
        this.showWarningMessage(5); 
    }


    stopTimers() {
        console.log(this.waitingTimer)
        this.scene.time.removeEvent(this.waitingTimer)

        if (this.warningMessageTween)
            this.warningMessageTween.remove()

        if (this.warningMessage)
            this.warningMessage.destroy();
        
    }
     

    
}