import { _decorator, Component, Node, Sprite, UIOpacity, UITransform } from 'cc';
import { GameManager } from '../Core/GameManager';
import { OrderData } from '../Actor/Order/OrderData';
import { OrderCategory, OrderType } from '../Core/Enum';
import { PopupOrder } from './PopupOrder';
import { Order } from '../Actor/Order/OrderService';
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

    @property([OrderData])
    data: OrderData[] = [];

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

    customerOrder(order: Order){
        if(order.category == OrderCategory.THROW){
            this.popupOrder.orderBoom(order.text)
        }
        else{
            this.popupOrder.orderFood(this.getSpriteFrame(order.type), "x1");
        }
    }

    orderCompelete(){
        this.popupOrder.closed();
    }

    getSpriteFrame(key: OrderType){
        return this.data.find(d => d.orderName === key)?.spriteFr ?? null;
    }
}


