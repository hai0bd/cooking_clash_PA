import { _decorator, Component, director, Enum, Game, instantiate, Node, Prefab, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Order, OrderService } from '../Order/OrderService';
import { CustomerState, GameState, OrderCategory, OrderType } from '../../Core/Enum';
import { GameEvent } from '../../Core/Event';
import { GameManager } from '../../Core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(SkeletalAnimation)
    public anim: SkeletalAnimation = null;

    @property(Node)
    public hand: Node = null;

    public state: CustomerState = null;
    public orderService: OrderService = new OrderService();
    public order: Order = null;

    private brain: CustomerLogic;
    private handItem: Node;

    public init(parentNode: Node, pos: Vec3, rot: Quat, isTrouble: boolean): void {
        this.node.setParent(parentNode);
        this.node.setPosition(pos);
        this.node.setRotation(rot);

        if (isTrouble) this.brain = new TroubleCustomer();
        else this.brain = new NormalCustomer();

        this.brain.execute(this);
        console.log(OrderType[this.order.type]);
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
                        GameManager.instance.changeState(GameState.SERVE);
                        this.changeState(CustomerState.WAITING);
                    })
                    .start();
            })
            .start();
    }

    getOut(exitPoint: Node, destroyPoint: Node): void {
        this.changeState(CustomerState.WALKING);
        director.emit(GameEvent.OPEN_DOOR);
        tween(this.node)
            .to(0.5, { position: exitPoint.getPosition(), rotation: exitPoint.getRotation() })
            .call(() => {
                tween(this.node)
                    .to(0.5, { position: destroyPoint.getPosition(), rotation: destroyPoint.getRotation() })
                    .call(() => {
                        // GameManager.instance.changeState(GameState.WAIT_NEXT_CUSTOMER);
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

    public changeState(newState: CustomerState, node?: Node): void {
        this.state = newState;

        switch (this.state) {
            case CustomerState.IDLE:
                this.anim.play("Idle");
                break;
            case CustomerState.WALKING:
                // this.anim.play("Walking");
                break;
            case CustomerState.WAITING:
                // this.anim.play("Waiting");
                break;
            case CustomerState.HAPPY:
                this.anim.play("Good");
                this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
                    this.changeState(CustomerState.WALKING);
                }, this);
                break;
            case CustomerState.ANGRY:
                // this.anim.play("Angry");
                break;
            case CustomerState.EATING:
                // this.anim.play("Eating");
                // this.changeState("Happy");
                break;
            case CustomerState.DRINKING:
                if(node){
                    this.handItem = instantiate(node);
                    this.handItem.setPosition(new Vec3(-0.025, 0.08, -0.05));
                    this.handItem.setRotationFromEuler(new Vec3(0, 0, -90));
                    this.hand.addChild(this.handItem);
                }
                this.anim.play("Drink");
                this.anim.once(SkeletalAnimation.EventType.FINISHED, () => {
                    this.handItem.destroy();
                    this.changeState(CustomerState.HAPPY)
                }, this);
            case CustomerState.SCARED:
                // this.anim.play("Scared");
                break;
            default:
                break;
        }
    }

    protected WaitingOrder(): void {
    }
}

abstract class CustomerLogic {
    abstract execute(customer: Customer): void;
}

class NormalCustomer extends CustomerLogic {
    execute(customer: Customer): void {
        customer.order = customer.orderService.getRandomOrder();
    }
}

class TroubleCustomer extends CustomerLogic {
    execute(customer: Customer): void {
        customer.order = {
            category: OrderCategory.THROW,
            type: OrderType.BOMB,
            text: "BOMB"
        };
    }
}
