import { _decorator, Component, Node, Quat, Vec3 } from 'cc';
import { Customer, CustomerState } from './Customer';
import { OrderService } from './Order/OrderService';
import { OrderType } from './Order/OrderType';
const { ccclass, property } = _decorator;

@ccclass('NormalCustomer')
export class NormalCustomers extends Customer {
    // listOrder: OrderType[] = [OrderType.COFFEE, OrderType.BEEFSTEAK, OrderType.SALAD, OrderType.SANDWICH];
    public init(parentNode: Node, pos: Vec3, rot: Quat): void {
        super.init(parentNode, pos, rot);
        // this.state = CustomerState.IDLE;
        // this.order = this.orderService.getRandomOrder();
        this.order = {
            type: OrderType.COFFEE,
            text: "Coffee with 50% milk and sugar",
        }
    }

    protected WaitingOrder(): void {
        this.anim.play("Waiting");
        
    }
}
/* 
enum OrderType{
    COFFEE,
    BEEFSTEAK,
    SALAD,
    SANDWICH
} */
