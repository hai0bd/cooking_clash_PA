import { _decorator, Component, Node, Vec3 } from 'cc';
import { Customer, CustomerState } from './Customer';
const { ccclass, property } = _decorator;

@ccclass('NormalCustomer')
export class NormalCustomers extends Customer {
    public init(parentNode: Node, pos?: Vec3): void {
        super.init(parentNode, pos);
        this.state = CustomerState.IDLE;
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


