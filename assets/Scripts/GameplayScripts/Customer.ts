import { _decorator, Component, Enum, Node, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { Order, OrderService } from './Order/OrderService';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(SkeletalAnimation)
    public anim: SkeletalAnimation = null;

    public state: CustomerState = null;
    public orderService: OrderService = new OrderService();
    public order: Order = null;

    public init(parentNode: Node, pos: Vec3, rot: Quat): void {
        this.node.setParent(parentNode);
        this.node.setPosition(pos);
        this.node.setRotation(rot);
    }

    getIn(midPoint: Node, orderPoint: Node): void {
        this.changeState(CustomerState.WALKING);
        tween(this.node)
        .to(0.5, {rotation: midPoint.getRotation() })
        .to(2, { position: midPoint.getPosition()})
        .call(() => {
            tween(this.node)
            .to(0.5, {rotation: orderPoint.getRotation() })
            .to(2, { position: orderPoint.getPosition()})
            .call(() => {
                this.changeState(CustomerState.WAITING);
            })
            .start();
        })
        .start();
    }

    getOut(exitPoint: Node, destroyPoint: Node): void {
        this.changeState(CustomerState.WALKING);
        tween(this.node)
        .to(0.5, { position: exitPoint.getPosition(), rotation: exitPoint.getRotation() })
        .call(() => {
            tween(this.node)
            .to(0.5, { position: destroyPoint.getPosition(), rotation: destroyPoint.getRotation() })
            .call(() => {
                this.node.destroy();
            })
            .start();
        })
        .start();
    }

    public isState(state: CustomerState): boolean {
        return state === this.state;
    }

    public changeState(newState: CustomerState): void {
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
                // this.anim.play("Happy");
                break;
            case CustomerState.ANGRY:
                // this.anim.play("Angry");
                break;
            case CustomerState.EATING:
                // this.anim.play("Eating");
                // this.changeState("Happy");
                break;
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
    abstract excute(customer: Customer): void;
}

class NormalCustomer extends CustomerLogic {
    excute(customer: Customer): void {

    }
}

class TroubleCustomers extends CustomerLogic {
    excute(customer: Customer): void {
    }
}

export enum CustomerState {
    IDLE,
    WALKING,
    WAITING,
    HAPPY,
    ANGRY,
    EATING,
    SCARED,
}