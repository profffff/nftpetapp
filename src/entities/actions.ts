import {
    petStartAttributes,
} from '../values/variables/gameData'

import {
    gameSettings,
    actionProbabilities,
    actionsDelay
} from '../values/constants/gameConstants'

import Timer from '../components/timer/gameTimer'

import  {Pet} from '../entities/pet'




class Actions {
    private currentAction: string | null = null;
    private selectedAction: string | null = null;
    private timer: Timer | null = null;
    private isCorrectButton: boolean = true;
    private pet?: Pet;

    private actionsMap = {
    'eatAction': this.eatAction.bind(this),
    'drinkAction': this.drinkAction.bind(this),
    'toiletAction': this.toiletAction.bind(this),
    'playAction': this.playAction.bind(this),
    'medicineAction': this.medicineAction.bind(this),
    'sleepAction': this.sleepAction.bind(this),
  }

    
    constructor(selectedAction: string, timer: Timer) {
        this.selectedAction = selectedAction;
        this.timer = timer;
        this.currentAction = petStartAttributes.currentAction
        this.checkAction();
     }

     public getIsCorrectButton() {
        return this.isCorrectButton;
     }

    private checkAction() {
        const crtAction = petStartAttributes.currentAction
        console.log( "crt", crtAction) 
        
        if (crtAction) {
            if (this.timer.timeEvent.paused === false ) {
                    this.timer.scaleTweenWarning()   
            }
            else if (crtAction === this.selectedAction && typeof this[crtAction] === 'function') {
                petStartAttributes.actionsDone += 1;    
                console.log('Yep') 
                
               // if (this.isGameFinished()) {
                    // Give NFT
             //   }
             //   else {
                    this.isCorrectButton = true;
                    this[crtAction](); //doesn't work properly
                 //  const actionFunction = this.actionsMap[crtAction];
                  //  actionFunction(); 
                    this.newAction();     
             //   }
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

    private newAction() {
        const generatedNextAction = this.generateRandomAction()
        this.currentAction = generatedNextAction
        petStartAttributes.currentAction = generatedNextAction
        const generatedDelay = this.generateRandomTimeBeforeAction()
        this.timer.start(generatedDelay)
    }

    public getCrtAction(): string {
        console.log(this.currentAction)
        return this.currentAction
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
        console.log("medicineAction");
    }

    private sleepAction(): void {
        console.log("sleepAction");
    }

    private wrongAction(): void {
        this.decreaseMood();
    }

    private increaseMood() {
        const random_num = Math.random() * 100;
        if (random_num < gameSettings.probIncMood) {
            if (petStartAttributes.mood < gameSettings.maxMood) {
                ++petStartAttributes.mood;
            }

        }
    }

    private decreaseMood() {
        console.log('moodDecreased')
        --petStartAttributes.mood;
    }

    private isGameFinished(): boolean {
        
        console.log(`actionsDone: ${petStartAttributes.actionsDone}, mood: ${petStartAttributes.mood}`);

        if (petStartAttributes.actionsDone >= gameSettings.maxNumActions &&
            petStartAttributes.mood >= gameSettings.minWinMood) {    
            return true;
        }

        return false;
    }

    private generateRandomAction(): string {
        const actions = Object.keys(actionProbabilities);

        const randomNumber = Math.random() * 100;
        let cumulativeProbability = 0;

        for (const action of actions) {
            cumulativeProbability += actionProbabilities[action];
            if (randomNumber < cumulativeProbability) {
                console.log('generated_action', action) 
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

}

export default Actions;