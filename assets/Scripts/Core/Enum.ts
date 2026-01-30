export enum Point {
    SpawnPoint = 0,
    MidPoint = 1,
    OrderPoint = 2,
    ExitPoint = 3,
    DestroyPoint = 4,
}

export enum GameState{
    START,
    SERVE,
    TIME_OUT,
    WAIT_NEXT_CUSTOMER,
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
    ORDER,
    WAITING,
    EATING,
    DRINKING,
    HAPPY,
    PAYING,
    ANGRY,
    KNOCKDOWN,
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
    BREAD = 8,
    BOMB = 16,
    CHICKEN = 32,
    CHEESE = 64,
    LETTUCE = 128,
    FINISHED = 256,
}

export enum OrderName{
    COFFEE = "COFFEE",
    BEEFSTEAK = "BEEFSTEAK",
    SALAD = "SALAD",
    SANDWICH = "SANDWICH",
    CHICKEN = "CHICKEN",
    BOMB = "BOMB"
}