import Phaser from 'phaser'

const timerDigitsColor = 0x000000

export default class Timer {
    private scene: Phaser.Scene;
    blackLayer: Phaser.GameObjects.Sprite;
    secondLayer: Phaser.GameObjects.Sprite;
    shape: Phaser.GameObjects.Graphics;
    mask: Phaser.Display.Masks.GeometryMask;
    seconds: number;
    timerText: Phaser.GameObjects.BitmapText;
    timeEvent: Phaser.Types.Time.TimerEventConfig;
    counter: Phaser.Tweens.Tween | null;;

    constructor(scene: Phaser.Scene, x: number, y: number, startTime?: number ) {
        this.scene = scene;

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
            //this.seconds = 30;         
           // this.shape.slice(this.secondLayer.x, this.secondLayer.y, this.secondLayer.displayWidth / 2, Phaser.Math.DegToRad(270), Phaser.Math.DegToRad(0), true);
            //this.shape.fillPath();
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
            scaleX: 3, 
            scaleY: 3, 
            duration: 1000,
            ease: 'Linear', 
            repeat: 0, 
            yoyo: true, 
            onComplete: () => {
                this.timerText.scaleX = 1.5;
                this.timerText.scaleY = 1.5;
                this.timerText.setTint(0xFFCCFF);
            }
            
        });
        this.timerText.setTint(timerDigitsColor);
    }

    getCurrentSeconds(): number {
        return this.seconds;
    }
}