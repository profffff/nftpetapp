export interface GameWindowConfig {
    width: number,
    height: number,
}

export interface PetImage  {
    imagePositionX: number,
    imagePositionY: number,
    imageScale: number,
}

export interface ButtonIcons  {
    iconPositionX: number,
    iconPositionY: number,
    iconScale: number,
}

export interface GameSettings  {
    minWinMood: number,
    maxNumActions: number,
    maxMood: number,
    probIncMood: number
}

export interface NumOfButtons {
    total_value: number;
}


export interface ActionProbabilies {
    [key: string]: number;
}

export interface TimerIcon  {
    timerPositionX: number,
    timerPositionY: number,
    timerScale: number,
}


export interface ActionsDelay {
    minTimeBeforeActon: number;
    maxTimeBeforeActon: number;
    waitingTimeForActionLite: number;
    waitingTimeForActionWarning: number;
    waitingTimeForActionPenalty: number;
}

export interface PetStartAttributes  {
    mood: number | null,
    actionsDone: number | null,
    currentAction: string | null, 
}



