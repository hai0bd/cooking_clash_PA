import { _decorator, Component, Label, Node, Sprite, SpriteFrame, tween, UIOpacity, UITransform } from 'cc';
import { OrderData } from '../Actor/Order/OrderData';
import { OrderCategory, OrderName, OrderType } from '../Core/Enum';
import { PopupOrder } from './PopupOrder';
import { Order } from '../Actor/Order/OrderService';
import { SpeechBubble } from './SpeechBubble';
import { RecipeData } from '../Actor/Order/RecipeData';
import { recipe } from '../Actor/Order/FoodRecipe';
import { Tut } from '../Tut';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static _instance: UIManager;

    @property(UIOpacity)
    warningScreen: UIOpacity = null;

    @property(UITransform)
    canvas: UITransform = null;

    @property(PopupOrder)
    popupOrder: PopupOrder = null;

    @property(SpeechBubble)
    speechBubble: SpeechBubble = null;

    @property(Tut)
    tut: Tut = null;

    @property([OrderData])
    orderData: OrderData[] = [];

    @property({type: [RecipeData]})
    recipeData: RecipeData[] = [];

    @property(Label)
    coinAmount: Label = null;

    public static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager;
        }
        return this._instance;
    }

    onLoad() {
        if (!UIManager._instance) {
            UIManager._instance = this;
        } else {
            this.destroy();
        }
    }

    addCoin(score: number) {
        const currentScore = Number(this.coinAmount.string);
        let i = 1;
        const baseScale = this.coinAmount.node.scale.clone();
        this.schedule(() => {
            tween(this.coinAmount.node)
                .to(0.08, { scale: baseScale.clone().multiplyScalar((i * 0.2) + 0.5) })
                .to(0.02, { scale: baseScale })
                .union()
                .start();
            this.coinAmount.string = (currentScore + i).toString();
            i++;
        }, i * 0.1, score - 1);
    }

    setBubbleTarget(node: Node) {
        this.speechBubble.targetNode = node;
    }

    visibleStore() {
        this.speechBubble.enabled = false;
    }


    customerOrder(order: Order) {
        this.tut.customerOrder(order);
        if (order.category == OrderCategory.THROW) {
            this.popupOrder.orderBoom(order.text)
        }
        else {
            const orderSprite = this.getOrderNameSprite(order.name);
            const recipeSprite = this.getRecipe(order.name);
            this.popupOrder.orderFood(orderSprite, recipeSprite);
        }
    }

    orderComplete() {
        this.popupOrder.closed();
    }

    getRecipe(orderName: OrderName): SpriteFrame[] {
        const recipeStep = recipe[orderName];
        let sprites: SpriteFrame[] = [];

        for (let i = 0; i < recipeStep.length - 1; i++) {
            sprites.push(this.getRecipeSprite(recipeStep[i].step));
        }

        return sprites;
    }

    getOrderNameSprite(key: OrderName) {
        return this.orderData.find(d => d.orderName === key)?.spriteFr ?? null;
    }

    getRecipeSprite(key: OrderType) {
        return this.recipeData.find(d => d.type === key)?.typeSprite ?? null;
    }
}


