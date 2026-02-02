import { _decorator, Component, director, Enum, Game, instantiate, Node, Prefab, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Order, OrderService } from '../Order/OrderService';
import { CustomerState, GameState, OrderCategory, OrderName, OrderType } from '../../Core/Enum';
import { GameEvent } from '../../Core/Event';
import { GameManager } from '../../Core/GameManager';
import { UIManager } from '../../UIScripts/UIManager';
import { CoinEffect } from '../../CoinEffect';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(SkeletalAnimation)
    public anim: SkeletalAnimation = null;

    @property(Node)
    public hand: Node = null;

    public order: Order = null;
    public state: CustomerState = null;
    public coin: CoinEffect = null;
    public orderService: OrderService = new OrderService();

    private brain: CustomerLogic;
    private handItem: Node;
    private exitPoint: Node;
    private destroyPoint: Node;

    public init(parentNode: Node, pos: Vec3, rot: Quat, isTrouble: boolean): void {
        this.node.setParent(parentNode);
        this.node.setPosition(pos);
        this.node.setRotation(rot);

        if (isTrouble) this.brain = new TroubleCustomer();
        else this.brain = new NormalCustomer();

        this.brain.execute(this);
    }

    servedOrder(node: Node, exitPoint: Node, destroyPoint: Node): OrderCategory {
        if (this.order.category == OrderCategory.DRINK)
            this.changeState(CustomerState.DRINKING, node);
        else if (this.order.category == OrderCategory.EAT) {
            this.changeState(CustomerState.EATING, node);
        }
        else {
            this.scheduleOnce(() => { this.changeState(CustomerState.KNOCKDOWN); }, 0.5);
        }
        this.exitPoint = exitPoint;
        this.destroyPoint = destroyPoint;

        return this.order.category;
    }

    getIn(midPoint: Node, orderPoint: Node): void {
        this.changeState(CustomerState.WALKING);
        tween(this.node)
            .to(0.5, { rotation: midPoint.getRotation() })
            .to(2, { position: midPoint.getPosition() })
            .call(() => {
                director.emit(GameEvent.OPEN_DOOR)
                tween(this.node)
                    .to(0.5, { rotation: orderPoint.getRotation() })
                    .to(2, { position: orderPoint.getPosition() })
                    .call(() => {
                        this.changeState(CustomerState.ORDER);
                        GameManager.instance.changeState(GameState.SERVE);
                        UIManager.instance.customerOrder(this.order);
                    })
                    .start();
            })
            .start();
    }

    getOut(exitPoint: Node, destroyPoint: Node): void {
        GameManager.instance.changeState(GameState.WAIT_NEXT_CUSTOMER);
        this.changeState(CustomerState.WALKING);
        director.emit(GameEvent.OPEN_DOOR);
        tween(this.node)
            .to(1, { position: exitPoint.getPosition(), rotation: exitPoint.getRotation() })
            .call(() => {
                tween(this.node)
                    .to(0.5, { position: destroyPoint.getPosition(), rotation: destroyPoint.getRotation() })
                    .call(() => {
                        GameManager.instance.NextCustomer();
                        this.node.destroy();
                    })
                    .start();
            })
            .start();
    }

    public isState(state: CustomerState): boolean {
        return state === this.state;
    }

    public changeState(newState: CustomerState, foodNode?: Node): void {
        if (this.state == newState) return;
        this.state = newState;

        switch (this.state) {
            case CustomerState.IDLE:
                this.anim.play("idle");
                break;
            case CustomerState.WALKING:
                this.brain.walk();
                break;
            case CustomerState.ORDER:
                this.brain.startOrder();
                break;
            case CustomerState.HAPPY:
                this.anim.play("satisfied");
                this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
                    this.changeState(CustomerState.PAYING);
                }, this);
                break;
            case CustomerState.PAYING:
                this.coin.customerPurchase(this.anim);
                this.scheduleOnce(() => { this.getOut(this.exitPoint, this.destroyPoint); }, 2);
                break;
            case CustomerState.ANGRY:
                this.anim.play("angry");
                break;
            case CustomerState.EATING:
                this.getFood(foodNode, "eat");
                break;
            case CustomerState.DRINKING:
                this.getFood(foodNode, "drink");
                break;
            case CustomerState.WAITING:
                break;
            case CustomerState.KNOCKDOWN:
                this.anim.play("knockdown");
                this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
                    this.scheduleOnce(() => {
                        this.anim.play("get_up");
                        this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
                            this.changeState(CustomerState.SCARED);
                        })
                    }, 1.5);
                });
                break;
            case CustomerState.SCARED:
                this.scheduleOnce(() => { this.getOut(this.exitPoint, this.destroyPoint); }, 0.5);
                break;
            default:
                break;
        }
    }

    getFood(food: Node, animName: string) {
        if (food) {
            this.handItem = instantiate(food);
            this.handItem.setPosition(new Vec3(-0.025, 0.08, -0.05));
            this.handItem.setRotationFromEuler(new Vec3(0, 0, -90));
            this.hand.addChild(this.handItem);
        }
        this.anim.play(animName);
        this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
            this.handItem.destroy();
            this.changeState(CustomerState.HAPPY)
        }, this);
    }
}

abstract class CustomerLogic {
    customer: Customer;
    abstract execute(customer: Customer): void;
    abstract startOrder(): void;
    abstract walk(): void;
}

class NormalCustomer extends CustomerLogic {
    execute(customer: Customer): void {
        this.customer = customer;
        customer.order = customer.orderService.getRandomOrder();
    }
    startOrder() {
        this.customer.anim.play("idle");
    }
    walk(): void {
        this.customer.anim.play("happy_walk");
    }
}

class TroubleCustomer extends CustomerLogic {
    execute(customer: Customer): void {
        this.customer = customer;
        customer.order = {
            category: OrderCategory.THROW,
            name: OrderName.BOMB,
            text: customer.orderService.getRandomLine(OrderName.BOMB)
        };
    }
    startOrder() {
        this.customer.anim.play("karma_talk");
        director.emit(GameEvent.CAMERA_SHAKE);
    }
    walk(): void {
        this.customer.anim.play("angry_walk");
    }
}
