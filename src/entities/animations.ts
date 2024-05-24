import {  } from "../values/constants/gameConstants";

export class Animations  {
    private textureKey: string;
    private petAnimation: Phaser.Tweens.Tween | null;
    private scene:  Phaser.Scene;
    private x: number;
    private y: number;
    private petImage: Phaser.GameObjects.Sprite;
    private petWantAnimation:  false | Phaser.Animations.Animation;
    private wantText: Phaser.GameObjects.BitmapText  | null = null;
    private  wantThink1Sprite: Phaser.GameObjects.Sprite;
   // mood: number;

    constructor(scene: Phaser.Scene, posX: number, posY: number, petImage: Phaser.GameObjects.Sprite) {
        this.scene = scene;
        this.x = posX;
        this.y = posY;
        this.petImage = petImage;
    }

    public disableAllAnimations() {
        console.log('disableAllAnimations')
        if (this.petAnimation?.isPlaying ) {
            this.petAnimation.stop()
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

        
        this.wantThink1Sprite = this.scene
            .add.sprite(x, y, 'wantThink1')
            .play('want')

        if (this.wantText)
            this.wantText.destroy()
        
        this.wantText = this.scene.add.bitmapText(x - 45, y - 55, 'digital-font', 'I need ' + action.slice(0,-6)).setScale(0.7);
        this.wantText.setTint(0xFF21FF); //0xFE0101 red
            
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
    
        const wrongBack = this.scene.add.sprite(0, 0, 'wrongButtonBackground').setOrigin(0,0);
        
        this.scene.add.tween({
            targets: wrongBack,
            duration: 800,
            alpha: 0,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                wrongBack.destroy()
            }
        });

    }






}