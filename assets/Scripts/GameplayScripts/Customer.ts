import { _decorator, Component, Enum, Node, SkeletalAnimation, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Customer')
export class Customer extends Component {
    @property(SkeletalAnimation)
    private anim: SkeletalAnimation = null;

    public state: CustomerState = null;

    public init(parentNode: Node, pos?: Vec3): void{
        this.node.setParent(parentNode);
        if (pos) {
            this.node.setPosition(pos);
        }
    }

    public isState(state: CustomerState): boolean {
        return state === this.state;
    }

    public changeState(newState: CustomerState): void {
        this.state = newState;

        switch (this.state) {
            case CustomerState.IDLE:
                this.anim.play();
                break;
            case CustomerState.HAPPY:
                this.anim.play();
                break;
            case CustomerState.ANGRY:
                this.anim.play();
                break;
            case CustomerState.EATING:
                this.anim.play();
                break;
            case CustomerState.SCARED:
                this.anim.play();
                break;
            default:
                break;
        }
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
    HAPPY,
    ANGRY,
    EATING,
    SCARED,
}