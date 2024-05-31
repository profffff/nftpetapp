import {
    petAttributes,
} from '../values/variables/gameData'

import {
    gameSettings,
    actionProbabilities,
    actionsDelay
} from '../values/constants/gameConstants'

import Timer from '../components/timer/gameTimer'

import  {Pet} from '../entities/pet'

import { EventBus } from '../game/EventBus';




class Actions {
    private currentAction: string | null = null;
    private currentDelay: number | null = null;

    private selectedAction: string | null = null;
    private timer: Timer | null = null;

    private isCorrectButton: boolean = true; 
    private backgroundManager: string | null = null;

    private isGameFinished: boolean = false;
  

    private pet?: Pet;


    constructor(selectedAction: string, timer: Timer) {
        this.selectedAction = selectedAction;
        this.timer = timer;
        this.currentAction = petAttributes.currentAction
        this.checkAction();
     }

     public getIsCorrectButton() {
        return this.isCorrectButton;
     }

     public getBackgroundManager(): string {
        return this.backgroundManager;
     }

    private checkAction() {
        const crtAction = petAttributes.currentAction
        console.log( "crt", crtAction) 
        
        if (crtAction) {
            console.log('я тута')
            this.backgroundManager = null;

            if (this.timer.timeEvent.paused === false ) {
                    this.timer.scaleTweenWarning()   
            }
            else if (crtAction === this.selectedAction && typeof this[crtAction] === 'function') {
                petAttributes.actionsDone += 1;    
                this.isCorrectButton = true;

               if (this.isGameFinishedCheck()) {
                    this.isGameFinished = true;
               }
               else 
                {          
                    this[crtAction](); 
                    this.newAction();     
                }
            }   
            else {
                this.isCorrectButton = false;
                this.wrongAction();
            }
        }
        else {
            //first run
            this.newAction()
        }
    }
    
    public setIsGameFinished(val: boolean) {
        this.isGameFinished = val;
    }

    public getIsGameFinished() {
       return this.isGameFinished;
    }

    private isGameFinishedCheck(): boolean {
        
        console.log(`actionsDone: ${petAttributes.actionsDone}, mood: ${petAttributes.mood}`);

        if (petAttributes.actionsDone >= gameSettings.maxNumActions &&
            petAttributes.mood >= gameSettings.minWinMood) {    
            return true;
        }

        return false;
    }


    private newAction() {
        this.currentAction = this.generateRandomAction()
        petAttributes.currentAction = this.currentAction
        this.currentDelay = this.generateRandomTimeBeforeAction()
        this.timer.start(this.currentDelay) //too implicit
    }

    public getCrtAction(): string {
        console.log(this.currentAction)
        return this.currentAction
    }

    public getCrtDelay(): number {
        return this.currentDelay;
    }


    private eatAction(): void {
        this.increaseMood()
        console.log("eatAction");
    }

    private drinkAction(): void {
        this.increaseMood()
        console.log("drinkAction");
    }

    private toiletAction(): void {
        console.log("toiletAction");
    }

    private playAction(): void {
        this.increaseMood()
        console.log("playAction");
    }

    private medicineAction(): void {
        this.backgroundManager = 'aidBackground'
        console.log("medicineAction");
    }

    private sleepAction(): void {
        this.backgroundManager = 'sleepBackground'
        console.log("sleepAction");
    }

    private wrongAction(): void {
        this.decreaseMood();
    }

    private increaseMood() {
        const random_num = Math.random() * 100;
        if (random_num < gameSettings.probIncMood) {
            if (petAttributes.mood < gameSettings.maxMood) {
                ++petAttributes.mood;
                this.backgroundManager = 'increaseMoodBackground'
            }

        }
    }

    public decreaseMood() {
        --petAttributes.mood;
        this.isGameOver();
    }

    private isGameOver(): void {
         if (petAttributes.mood === 0)
         {
            EventBus.emit('gameOver')
         }
    }


    

    private generateRandomAction(): string {
        const actions = Object.keys(actionProbabilities);

        const randomNumber = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const action of actions) {
            cumulativeProbability += actionProbabilities[action];
            if (randomNumber < cumulativeProbability) {
                return action;
            }
        }

        // If all probabilities are 0, return a random action
        return actions[Math.floor(Math.random() * actions.length)];
    }

    private generateRandomTimeBeforeAction(): number {
        const randomTime = Math.floor(Math.random() * (actionsDelay.maxTimeBeforeActon - actionsDelay.minTimeBeforeActon + 1)) + actionsDelay.minTimeBeforeActon;
        return randomTime;
    }

    public setKey(selectedAction: string) {
        this.selectedAction = selectedAction;
    }

    public setTImer(timer: Timer) {
        this.timer = timer;
    }

    public setWaitingTimer() {
        this.timer.liteTimer();
    }

    public resetPenaltyTimer() {
        this.timer.penaltyTimer();
    }

    public removeWaitingTImers() {
        this.timer.stopTimers()
    }

}

export default Actions;