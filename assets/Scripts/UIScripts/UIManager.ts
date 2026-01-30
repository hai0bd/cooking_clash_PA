import { _decorator, Component, Label, Node, Sprite, tween, UIOpacity, UITransform } from 'cc';
import { OrderData } from '../Actor/Order/OrderData';
import { OrderCategory, OrderName, OrderType } from '../Core/Enum';
import { PopupOrder } from './PopupOrder';
import { Order } from '../Actor/Order/OrderService';
import { SpeechBubble } from './SpeechBubble';
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

    @property([OrderData])
    data: OrderData[] = [];

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
        /* for (let i = 1; i <= score; i++) {
            this.coinAmount.string = (currentScore + i).toString();
            this.scheduleOnce(() => { }, 0.5);
        } */
        let i = 1;
        const baseScale = this.coinAmount.node.scale.clone();
        this.schedule(() => {
            tween(this.coinAmount.node)
                .to(0.08, { scale: baseScale.clone().multiplyScalar((i * 0.2) + 1) })
                .to(0.05, { scale: baseScale })
                .union()
                .start();
            this.coinAmount.string = (currentScore + i).toString();
            i++;
        }, 0.1, score - 1);
    }

    setBubbleTarget(node: Node) {
        this.speechBubble.targetNode = node;
    }

    visibleStore() {
        this.speechBubble.enabled = false;
    }


    customerOrder(order: Order) {
        if (order.category == OrderCategory.THROW) {
            this.popupOrder.orderBoom(order.text)
        }
        else {
            this.popupOrder.orderFood(this.getSpriteFrame(order.name), "x1");
        }
    }

    orderComplete() {
        this.popupOrder.closed();
    }

    getSpriteFrame(key: OrderName) {
        return this.data.find(d => d.orderName === key)?.spriteFr ?? null;
    }
}


