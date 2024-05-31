import {
    PetStartAttributes,
} from '../../types/gameConstantsAPI'


export var petAttributes: PetStartAttributes  = {
    mood: null,
    actionsDone: null,
    currentAction: null, 
}


export function initializePetAttributes(startAttributes: PetStartAttributes) {
    petAttributes = { ...startAttributes };
}