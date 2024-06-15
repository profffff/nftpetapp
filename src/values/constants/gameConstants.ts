import {
    GameWindowConfig,
    PetImage,
    GameSettings,
    ButtonIcons,
    NumOfButtons,
    ActionProbabilies,
    ActionsDelay,
    TimerIcon,
    PetStartAttributes
} from '../../types/gameConstantsAPI'

export const gameWindowConfig: GameWindowConfig = {
    width: 1024,
    height: 768,
}

export const petImage: PetImage = {
    imagePositionX: gameWindowConfig.width / 2,
    imagePositionY: gameWindowConfig.height / 2 + 50,
    imageScale: 0.55,
}

export const numOfButtons: NumOfButtons  = {
    total_value: 6,
}

export const buttonIcons: ButtonIcons  = {
    iconPositionX: gameWindowConfig.width / (numOfButtons.total_value + 1),
    iconPositionY: gameWindowConfig.height - 80,
    iconScale: 0.17
}

export const timerIcon: TimerIcon  = {
    timerPositionX: 130,
    timerPositionY: 130,
    timerScale: 0.5
}

//%, sum 100
export const actionProbabilities: ActionProbabilies =
{
    'eatAction': 20,
    'drinkAction': 25,
    'toiletAction': 10,
    'playAction': 20,
    'medicineAction': 10,
    'sleepAction': 15,
}

export const actionsDelay: ActionsDelay  = {
    minTimeBeforeActon: 10,
    maxTimeBeforeActon: 20,
    waitingTimeForActionWarning: 60,
    waitingTimeForActionPenalty: 60,
}

export const petStartAttributes: PetStartAttributes  = {
    mood: 8, 
    actionsDone: 0,
    currentAction: null, 
}

export const gameSettings: GameSettings = {
    minWinMood: 8, 
    maxNumActions: 15, 
    maxMood: 10,
    probIncMood: 40,
}
