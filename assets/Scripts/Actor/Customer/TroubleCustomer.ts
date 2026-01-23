/* import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { Customer } from './Customer';
import { OrderType } from '../../Core/Enum';
const { ccclass, property } = _decorator;

@ccclass('TroubleCustomer')
export class TroubleCustomers extends Customer {
    public init(parentNode: Node, pos: Vec3, rot: Quat): void {
        super.init(parentNode, pos, rot);
        // this.state = CustomerState.ANGRY;
        this.order = {
            type: OrderType.BOMB,
            text: "Bomb",
        };
    }

    protected WaitingOrder(): void {
        this.anim.play("Angry");
    }
}


 */