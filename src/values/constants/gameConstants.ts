import {
    GameWindowConfig,
    PetImage,
    GameSettings,
    ButtonIcons,
    NumOfButtons,
    ActionProbabilies,
    ActionsDelay,
    TimerIcon
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

export const gameSettings: GameSettings = {
    minWinMood: 8,
    maxNumActions: 5,
    maxMood: 10,
    probIncMood: 40,
}


export const numOfButtons: NumOfButtons  = {
    total_value: 6,
}

export const buttonIcons: ButtonIcons  = {
    iconPositionX: gameWindowConfig.width / (numOfButtons.total_value + 1),
    iconPositionY: gameWindowConfig.height - 80,
    iconScale: 0.2
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
    minTimeBeforeActon: 1,
    maxTimeBeforeActon: 2,
    waitingTimeForActionLite: 10000,
    waitingTimeForActionMeduim: 10000,
    waitingTimeForActionPenalty: 10000,
}


