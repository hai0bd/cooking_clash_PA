import { _decorator, CCInteger, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { UIManager } from '../UIScripts/UIManager';
import { Customer, CustomerState } from './Customer';
import { TroubleCustomers } from './TroubleCustomer';
import { NormalCustomers } from './NormalCustomer';
import { Order } from './Order/OrderService';
import { PlayerController } from './PlayerController';
import { OrderType } from './Order/OrderType';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    @property(CCInteger)
    private customerLimit: number = 3;

    @property(PlayerController)
    private player: PlayerController = null;

    @property(Prefab)
    private customerPrefab: Prefab[] = [];

    @property(Node)
    private customerParentNode: Node | null = null;

    @property(Node)
    private listPoint: Node[] = [];


    private customerIndex: number = 1;
    private customer: Customer | null = null;

    public static get instance(): GameManager {
        if (!this._instance) {
            this._instance = new GameManager();
        }
        return this._instance;
    }

    onLoad() {
        if (!GameManager._instance) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }
    }
    start() {
        this.genCustomers();
    }

    nextCustomer(): void {
        this.customerIndex++;
        this.genCustomers();
    }

    private genCustomers(): void {
        const customerNode = instantiate(this.customerPrefab[0]);

        if (this.customerIndex % 2 == 0) this.customer = customerNode.addComponent(TroubleCustomers);
        else this.customer = customerNode.addComponent(NormalCustomers);

        if (this.customer) {
            const targetPoint = this.customerIndex == 0 ? Point.OrderPoint : Point.SpawnPoint;
            const pos = this.listPoint[targetPoint].position;
            const rot = this.listPoint[targetPoint].rotation;
            this.customer.init(this.customerParentNode, pos, rot);

            if(targetPoint === Point.SpawnPoint){
                //customer move to mid point and then to order point
                this.customer.getIn(this.listPoint[Point.MidPoint], this.listPoint[Point.OrderPoint]);
            }
            else this.customer.changeState(CustomerState.WAITING);
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

    public serveOrder(orderType: OrderType) {
        if(this.customer && this.customer.order.type === orderType)
        {
            this.customer.changeState(CustomerState.EATING);
            setTimeout(() => {
                this.customer?.getOut(this.listPoint[Point.ExitPoint], this.listPoint[Point.DestroyPoint]);
                // UIManager.instance.updateScore(10);
            }, 5000);
        }
        return false;
    }
}


enum Point {
    SpawnPoint = 0,
    MidPoint = 1,
    OrderPoint = 2,
    ExitPoint = 3,
    DestroyPoint = 4,
}