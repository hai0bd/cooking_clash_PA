import { OrderType } from "../../Core/Enum"

export const recipe = {
    "SANDWICH": [
        { step: OrderType.BREAD, },
        { step: OrderType.LETTUCE },
        { step: OrderType.BEEFSTEAK },
        { step: OrderType.CHEESE },
        { step: OrderType.BREAD },
        { step: OrderType.FINISHED }
    ],
    "COFFEE": [
        { step: OrderType.COFFEE },
        { step: OrderType.FINISHED }
    ],
    "BEEFSTEAK": [
        { step: OrderType.BEEFSTEAK },
        { step: OrderType.FINISHED }
    ],
    "CHICKEN": [
        { step: OrderType.CHICKEN },
        { step: OrderType.FINISHED }
    ],
    "SALAD": [
        { step: OrderType.SALAD },
        { step: OrderType.FINISHED }
    ],
    "BOMB":[
        {step: OrderType.BOMB},
        {step: OrderType.FINISHED}
    ]
}