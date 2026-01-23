import { _decorator, Component, Game, Node } from 'cc';
import { Order, OrderService } from './OrderService';
import { GameManager } from '../../Core/GameManager';
import { Customer } from '../Customer/Customer';
import { CustomerState, GameState, OrderCategory, OrderType, Point } from '../../Core/Enum';
const { ccclass, property } = _decorator;

@ccclass('OrderManager')
export class OrderManager extends Component {
    private static _instance: OrderManager;

    public customer: Customer = null;
    public listPoint: Node[] = [];

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
    }

    public customerOrder(order: Order): void {
        if (this.customer && this.customer.isState(CustomerState.WAITING)) {
            /* this.customer.changeState(CustomerState.EATING);
            setTimeout(() => {
                this.customer?.getOut(this.listPoint[Point.ExitPoint], this.listPoint[Point.DestroyPoint]);
                UIManager.instance.updateScore(10);
                this.nextCustomer();
            }, 5000); */
        }
    }

    public verifyOrder(orderType: OrderType, node?: Node): OrderCategory {
        if (this.customer && this.customer.order.type === orderType) {
            GameManager.instance.changeState(GameState.WAIT_NEXT_CUSTOMER);
            this.serveOrder(this.customer.order, node);
            return this.orderService.getCategory(orderType);
        }
        else {
            return null;
        }
    }

    public serveOrder(order: Order, node?: Node) {
        console.log("customer eating");
        // GameManager.instance.changeState(GameState.WAIT_NEXT_CUSTOMER);
        if (this.customer.order.category == OrderCategory.DRINK)
            this.customer.changeState(CustomerState.DRINKING, node);
        setTimeout(() => {
            this.customer?.getOut(this.listPoint[Point.ExitPoint], this.listPoint[Point.DestroyPoint]);
            // UIManager.instance.updateScore(10);
        }, 5000);
    }
}


