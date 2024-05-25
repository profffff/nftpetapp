import { Animations } from "./animations";


import {
    petStartAttributes,
} from '../values/variables/gameData'


export class Pet extends Phaser.GameObjects.Sprite {
    private animation?: Animations; 
    private mood: number;
    private actionsDone: number;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, scale: number) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.x = x;
        this.y = y;

        this.scene.add.existing(this).setScale(scale);

        this.animation = new Animations(scene, x, y, this);

        this.mood = petStartAttributes.mood;
        this.actionsDone = petStartAttributes.actionsDone;

       // this.animation.petHappyAnimation();

      
         //this.scene.add.image(x, y, texture).setScale(scale);
        

       // this.scene.add.existing(this);
       
    }

    public playWantsAnimation()
    {   
        this.animation.petWantsAnimation(this.x + 180, this.y - 200, petStartAttributes.currentAction)
    }

    public stopWantsAnimation()
    {   
        this.animation.stopPetWantsAnimation()
    }

    public isPlayingWantsAnimation(): boolean {
        return this.animation.isPlayingWantsAnimation();
    }

    public showWrongButtonBackground() {
        this.animation.showWrongButtonBackground()
    }

    public showBackground(backgroundKey: string, animationDuration: number) {
        this.animation.showBackground(backgroundKey, animationDuration)
    }

    update(delta) {
 
    }
    
    
    public moodAnimation() {
        
        if (this.mood === petStartAttributes.mood) {
            //nothing
        }      
        else {
                this.mood = petStartAttributes.mood
                console.log('moodChanged', this.mood)
                switch (this.mood) {
                    case 0:
                        //dead
                        break;
                    case 1:
                    case 2:
                        this.animation.disableAllAnimations();
                        this.animation.setAngryMood();
                        break;
                    case 3:
                    case 4:
                        this.animation.disableAllAnimations();
                        this.animation.setSadMood();
                        break;
                    case 5:   
                    case 6:
                        this.animation.disableAllAnimations();
                        break
                    case 7:
                    case 8:
                        this.animation.disableAllAnimations();
                        this.animation.petInGoodMoodAnimation();
                        break;
                    case 9:
                    case 10:
                        this.animation.disableAllAnimations();
                        this.animation.petHappyAnimation();
                        break;
                }
        }
    }
    

}