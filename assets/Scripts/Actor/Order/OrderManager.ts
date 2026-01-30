import { _decorator, Component, director, Enum, Game, instantiate, Node, Prefab, tween, Vec3 } from 'cc';
import { Order, OrderService } from './OrderService';
import { Customer } from '../Customer/Customer';
import { CustomerState, OrderCategory, OrderName, OrderType, Point } from '../../Core/Enum';
import { UIManager } from '../../UIScripts/UIManager';
import { recipe } from './FoodRecipe';
import { DisplayData } from './DisplayData';
import { GameEvent } from '../../Core/Event';
const { ccclass, property } = _decorator;

@ccclass('OrderManager')
export class OrderManager extends Component {
    private static _instance: OrderManager;

    @property([DisplayData])
    displayData: DisplayData[] = [];

    @property(Node)
    displayParent: Node = null;

    public customer: Customer = null;
    public listPoint: Node[] = [];

    private currentStep: number = 0;
    private orderComplete: boolean = false;
    private prefabMap: Map<OrderName, Prefab[]> = new Map();
    private currentDisplay: Node = null;
    private orderService: OrderService = new OrderService();

    public static get instance(): OrderManager {
        if (!this._instance) {
            console.warn("Chua co instance cua OrderManager");
        }
        return this._instance;
    }

    onLoad() {
        if (!OrderManager._instance) {
            OrderManager._instance = this;
        } else {
            this.destroy();
        }

        for (const data of this.displayData) {
            if (data.orderName && data.prefab) {
                this.prefabMap.set(data.orderName, data.prefab);
            }
        }
    }

    checkAction(orderType: OrderType, food: Node): OrderCategory {
        const currentRecipe = this.getRecipe(this.customer.order);
        if (orderType == currentRecipe[this.currentStep].step) {
            this.currentStep++;
            if (this.currentStep >= currentRecipe.length) {
                this.serveOrder(food);
                this.currentDisplay.destroy();
                this.currentDisplay = null;
                this.currentStep = 0;
            }
            else {
                this.orderComplete = false;
                this.displayFood(food);
            }
        }
        return this.orderService.getCategory(this.customer.order.name);
    }

    displayFood(food: Node) {
        if (this.currentDisplay) { this.currentDisplay.destroy(); this.currentDisplay = null; }
        const orderName = this.customer.order.name;
        const prefab = this.getPrefab(orderName)[this.currentStep - 1];

        const node = instantiate(prefab);
        this.displayParent.addChild(node);
        this.currentDisplay = node;

        const startPos = food.getWorldPosition();
        const endPos = node.getPosition();
        this.tweenfood(node, startPos, endPos, 0.1);
    }

    tweenfood(food: Node, startPos: Vec3, endPos: Vec3, duration) {
        // const duration = 0.1;
        const height = 0.5;

        const currentPos = new Vec3();

        tween(food)
            .to(duration, {}, {
                onUpdate: (_, t) => {
                    currentPos.x = startPos.x + (endPos.x - startPos.x) * t;
                    currentPos.z = startPos.z + (endPos.z - startPos.z) * t;

                    currentPos.y =
                        startPos.y +
                        (endPos.y - startPos.y) * t +
                        height * 4 * t * (1 - t);

                    food.setWorldPosition(currentPos);
                }
            })
            .call(() => {
                const baseRot = food.eulerAngles.clone();
                const duration = 0.4;
                const maxAngle = 10;

                tween(food)
                    .to(duration, {}, {
                        onUpdate: (_, t) => {
                            const decay = 1 - t;
                            const angle = Math.sin(t * Math.PI * 6) * maxAngle * decay;

                            food.setRotationFromEuler(
                                baseRot.x,
                                baseRot.y,
                                baseRot.z + angle
                            );
                        }
                    })
                    .start();
            })
            .start();
    }

    getPrefab(key: OrderName) {
        return this.prefabMap.get(key);
    }

    getRecipe(order: Order) {
        return recipe[order.name];
    }

    serveOrder(node: Node) {
        console.log("customer eating");
        this.orderComplete = true;
        UIManager.instance.orderComplete();
        const category = this.customer.servedOrder(node, this.listPoint[Point.ExitPoint], this.listPoint[Point.DestroyPoint]);
        this.giveFood(node, category);
    }

    giveFood(food: Node, category: OrderCategory) {
        let endPos = new Vec3();
        const foodNode = instantiate(food);
        const duration = 0.25;
        const customerPos = this.listPoint[Point.OrderPoint].getWorldPosition();

        this.displayParent.addChild(foodNode);

        if (category == OrderCategory.THROW) {
            endPos = customerPos;
        }
        else {
            endPos = new Vec3(customerPos.x, customerPos.y + 0.05, customerPos.y);
        }

        this.tweenfood(foodNode, foodNode.getPosition(), endPos, duration);
        this.scheduleOnce(() => { foodNode.destroy() }, duration)
    }

    orderFailed() {
        if(this.orderComplete) return;
        this.customer.changeState(CustomerState.ANGRY);
        director.emit(GameEvent.CAMERA_SHAKE);
        if (this.currentDisplay) {
            this.currentDisplay.destroy();
            this.currentDisplay = null;
        }
        this.currentStep = 0;
        this.scheduleOnce(() => { this.customer.getOut(this.listPoint[Point.ExitPoint], this.listPoint[Point.DestroyPoint]) }, 2);
    }
}