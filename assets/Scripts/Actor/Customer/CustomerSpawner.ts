import { _decorator, CCInteger, Component, instantiate, Node, Prefab } from 'cc';
import { Customer } from './Customer';
import { CustomerState, GameState, Point } from '../../Core/Enum';
import { GameManager } from '../../Core/GameManager';
import { OrderManager } from '../Order/OrderManager';
const { ccclass, property } = _decorator;

@ccclass('CustomerSpawner')
export class CustomerSpawner extends Component {
    @property(CCInteger)
    private customerLimit: number = 3;

    @property(Prefab)
    private customerPrefab: Prefab[] = [];

    private listPoint: Node[] = [];
    private customerIndex: number = 1;
    private customer: Customer | null = null;

    init(listPoint: Node[]) {
        this.listPoint = listPoint;
        this.genCustomers();
    }

    nextCustomer(): void {
        this.customerIndex++;
        if (this.customerIndex > this.customerLimit) {
            GameManager.instance.changeState(GameState.END);
        }
        else this.genCustomers();
    }

    private genCustomers(): void {
        const customerNode = instantiate(this.customerPrefab[0]);
        this.customer = customerNode.getComponent(Customer);
        let isTrouble = false;
        if (this.customerIndex % 2 == 0) isTrouble = true;

        if (this.customer) {
            const targetPoint = this.customerIndex == 1 ? Point.OrderPoint : Point.SpawnPoint;
            const pos = this.listPoint[targetPoint].position;
            const rot = this.listPoint[targetPoint].rotation;
            this.customer.init(this.node, pos, rot, isTrouble);

            if (targetPoint === Point.SpawnPoint) {
                //customer move to mid point and then to order point
                this.customer.getIn(this.listPoint[Point.MidPoint], this.listPoint[Point.OrderPoint]);
            }
            else {
                GameManager.instance.changeState(GameState.SERVE)
                this.customer.changeState(CustomerState.WAITING);
            }

            OrderManager.instance.customer = this.customer;
        }
    }
}

