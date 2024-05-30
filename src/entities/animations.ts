import {  } from "../values/constants/gameConstants";

export class Animations  {
    private textureKey: string;
    private petAnimation: Phaser.Tweens.Tween | null;
    private petInGoodMood: Phaser.Tweens.Tween | null;
    private scene:  Phaser.Scene;
    private x: number;
    private y: number;
    private petImage: Phaser.GameObjects.Sprite;
    private petWantAnimation:  false | Phaser.Animations.Animation;
    private wantText: Phaser.GameObjects.BitmapText  | null = null;
    private  wantThink1Sprite: Phaser.GameObjects.Sprite;
    private petMoodSad: Phaser.GameObjects.Sprite  | null = null;
    private petMoodAngry: Phaser.GameObjects.Sprite  | null = null;

    constructor(scene: Phaser.Scene, posX: number, posY: number, petImage: Phaser.GameObjects.Sprite) {
        this.scene = scene;
        this.x = posX;
        this.y = posY;
        this.petImage = petImage;
    }

    public disableAllAnimations() {
        if (this.petAnimation?.isPlaying ) {
            this.petAnimation.stop()
            this.returnToOriginal();  
        }          
        if (this.petMoodAngry) {
            this.petMoodAngry.destroy();
        }
        if (this.petMoodSad) {
            this.petMoodSad.destroy();
        }
        if (this.petInGoodMood?.isPlaying) {
            this.petInGoodMood.stop()
            this.returnToOriginal();  
        }     
    }

    private returnToOriginal() 
    {
        this.scene.tweens.add({
            targets: this.petImage,
            x: this.x,
            y: this.y,
            duration: 2000,
        });
    }

    petInGoodMoodAnimation() {
        this.petInGoodMood = this.scene.tweens.add({
            targets: this.petImage,
            x: { value: [400, 600], duration: 2500, ease: 'Linear' },
            yoyo: true,
            repeat: -1,
            onRepeat: () => {
                this.petImage.setFlipX(true);
            },
            onYoyo: () => {
                this.petImage.setFlipX(false);
            },
        });
        this.petInGoodMood.play();
    }

    public petHappyAnimation () 
    {     
            this.petAnimation = this.scene.tweens.add({
                targets: this.petImage,
                x: { value: [290, 710], duration: 1500, ease: 'Sine.easeOut' },
                y: { value: 310, duration: 720, ease: 'Sine.easeOut' },
                yoyo: true,
                repeat: -1,
                onRepeat: () => {
                    this.petImage.setFlipX(true);
                },
                onYoyo: () => {
                    this.petImage.setFlipX(false);
                },
            });
            this.petAnimation.play();
        
    }


    public petWantsAnimation(x: number, y: number, action:string) {

        // const petWantsAnimation = this.scene.anims.create({
        //     key: 'want',
        //     frames: [
        //         { key: 'wantThink1' },
        //         { key: 'wantThink2' },
        //         { key: 'wantThink3', duration: 10000 + Math.random() * 5000 },
        //     ],
        //     frameRate: 6,
        //     repeat: -1,
        // });

        this.petWantAnimation = this.scene.anims.create({
            key: 'want',
            frames: this.scene.anims.generateFrameNumbers('wantThink',
                {
                    start: 0,
                    end: 2
                },
            
            ),
            frameRate: 3,
            repeat: -1,
            hideOnComplete: true,
            repeatDelay: 3000 + Math.random() * 5000,
        });

        if (this.wantText)
            this.wantText.destroy()

        if (this.wantThink1Sprite)
            this.wantThink1Sprite.destroy()

        this.wantThink1Sprite = this.scene
            .add.sprite(x, y, 'wantThink1').setDepth(20)
            .play('want')

        this.wantText = this.scene.add.bitmapText(x - 45, y - 55, 'digital-font', 'I need ' + action?.slice(0,-6)).setScale(0.7).setDepth(21);
        this.wantText.setTint(0x000000); 
    }

    public stopPetWantsAnimation() {
        if (this.wantThink1Sprite?.anims?.isPlaying) {
            this.wantThink1Sprite.stop();
            this.wantText.destroy();
            this.wantThink1Sprite.destroy();
        }    
    }
    
    public isPlayingWantsAnimation(): boolean {
        if (this.wantThink1Sprite?.anims?.isPlaying) {
            return true;
        }
        return false;
    }

    public showWrongButtonBackground() {
        const wrongBack = this.scene.add.sprite(0, 0, 'wrongButtonBackground').setOrigin(0,0).setDepth(1000);      
        this.scene.add.tween({
            targets: wrongBack,
            duration: 4500,
            alpha: 0,
            repeat: 0,
            onComplete: () => {
                wrongBack.destroy()
            }
        });
    }

    public showBackground(key: string, animationDuration: number) {
        const crtBackground = this.scene.add.sprite(0, 0, key).setOrigin(0,0).setDepth(1000); 
        const isSleepBackground = key === 'sleepBackground'
        this.scene.add.tween({
            targets: crtBackground,
            duration: isSleepBackground ? animationDuration * 1000 : 2000,
            alpha:  isSleepBackground ? 0.9 : 0,
            repeat: 0,
            onComplete: () => {
                crtBackground.destroy()
            }
        });
    }

    public setAngryMood() {
        this.scene.time.delayedCall(0, () => {
            this.petMoodAngry = this.scene.add.sprite(this.x, this.y, 'angryMouth').setDepth(100);
        }, [], this);  
    }

    public setSadMood() {
        this.scene.time.delayedCall(0, () => {
            this.petMoodSad = this.scene.add.sprite(this.x, this.y, 'sadMouth').setDepth(100);
        }, [], this);   
    }

   






}