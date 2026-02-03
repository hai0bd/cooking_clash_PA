import { OrderType } from "../../Core/Enum"

export const recipe = {
    "SANDWICH": [
        {
            step: OrderType.BREAD,
            describe: "PLACE ONE SLICE OF BREAD ON A PLATE",
        },
        {
            step: OrderType.LETTUCE,
            describe: "PUT SOME LETTUCE",
        },
        {
            step: OrderType.BEEFSTEAK,
            describe: "ADD PROTEIN",
        },
        {
            step: OrderType.CHEESE,
            describe: "ADD LOW-FAT CHEESE",
        },
        {
            step: OrderType.BREAD,
            describe: "PLACE THE REMAINING SLICE OF BREAD ON TOP",
        },
        {
            step: OrderType.FINISHED,
            describe: "GIVE IT TO CUSTOMER",
        }
    ],
    "COFFEE": [
        {
            step: OrderType.COFFEE,
            describe: "TAKE COFFEE",
        },
        {
            step: OrderType.FINISHED,
            describe: "GIVE IT TO CUSTOMER",
        }
    ],
    "BEEFSTEAK": [
        {
            step: OrderType.BEEFSTEAK,
            describe: "TAKE BEEFSTEAK",
        },
        {
            step: OrderType.FINISHED,
            describe: "GIVE IT TO CUSTOMER",
        }
    ],
    "CHICKEN": [
        {
            step: OrderType.CHICKEN,
            describe: "TAKE DRUMSTICK",
        },
        {
            step: OrderType.FINISHED,
            describe: "GIVE IT TO CUSTOMER",
        }
    ],
    "SALAD": [
        {
            step: OrderType.SALAD,
            describe: "TAKE MIXED VEGETABLE",
        },
        {
            step: OrderType.FINISHED,
            describe: "GIVE IT TO CUSTOMER",
        }
    ],
    "BOMB": [
        {
            step: OrderType.BOMB,
            describe: "GET THE BOMB",
        },
        {
            step: OrderType.FINISHED,
            describe: "THROW IT",
        }
    ]
}