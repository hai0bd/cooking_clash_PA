export enum Point {
    SpawnPoint = 0,
    MidPoint = 1,
    OrderPoint = 2,
    ExitPoint = 3,
    DestroyPoint = 4,
}

export enum GameState{
    START,
    WAIT_NEXT_CUSTOMER,
    SERVE,
    END
}

export enum ESound {
    Click,
    Pour,
    thank,
    great,
    Capy,
}

export enum CustomerState {
    IDLE,
    WALKING,
    WAITING,
    HAPPY,
    ANGRY,
    EATING,
    DRINKING,
    SCARED,
}

export enum OrderCategory{
    EAT,
    DRINK,
    THROW
}

export enum OrderType{
    COFFEE = 1,
    BEEFSTEAK = 2,
    SALAD = 4,
    SANDWICH = 8,
    BOMB = 16,
    CHICKEN = 32,
    CHIPS = 64,
}