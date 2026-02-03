import { _decorator, CCInteger, Component, instantiate, Node, Prefab, randomRange } from 'cc';
import { Customer } from './Customer';
import { CustomerState, GameState, Point } from '../../Core/Enum';
import { GameManager } from '../../Core/GameManager';
import { OrderManager } from '../Order/OrderManager';
import { UIManager } from '../../UIScripts/UIManager';
import { CoinEffect } from '../../CoinEffect';
const { ccclass, property } = _decorator;

@ccclass('CustomerSpawner')
export class CustomerSpawner extends Component {
    @property(CCInteger)
    private customerLimit: number = 3;

    @property(Prefab)
    private customerPrefab: Prefab[] = [];

    @property(CoinEffect)
    coin: CoinEffect = null;

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
        const random = Math.floor(randomRange(0, this.customerPrefab.length));
        const customerNode = instantiate(this.customerPrefab[random]);
        this.customer = customerNode.getComponent(Customer);
        let isTrouble = false;
        if (this.customerIndex % 2 == 0) isTrouble = true;

        if (this.customer) {
            const targetPoint = this.customerIndex == 1 ? Point.OrderPoint : Point.SpawnPoint;
            const pos = this.listPoint[targetPoint].position;
            const rot = this.listPoint[targetPoint].rotation;
            this.customer.init(this.node, pos, rot, isTrouble);
            this.customer.coin = this.coin;

            if (targetPoint === Point.SpawnPoint) {
                this.customer.getIn(this.listPoint[Point.MidPoint], this.listPoint[Point.OrderPoint]);
            }
            else {
                GameManager.instance.changeState(GameState.SERVE)
                UIManager.instance.customerOrder(this.customer.order);
                this.customer.changeState(CustomerState.ORDER);
            }

            OrderManager.instance.customer = this.customer;
            UIManager.instance.setBubbleTarget(customerNode);
        }
    }
}

