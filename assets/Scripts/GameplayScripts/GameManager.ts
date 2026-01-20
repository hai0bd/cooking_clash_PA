import { _decorator, CCInteger, Component, instantiate, Node, Prefab, Vec3 } from 'cc';
import { UIManager } from '../UIScripts/UIManager';
import { Customer } from './Customer';
import { TroubleCustomers } from './TroubleCustomer';
import { NormalCustomers } from './NormalCustomer';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    @property(CCInteger)
    private customerLimit: number = 3;

    @property(Prefab)
    private customerPrefab: Prefab[] = [];

    @property(Node)
    private customerParentNode: Node | null = null;

    @property(Node)
    private listPoint: Node[] = [];


    private customerIndex: number = 1;
    private customers: Customer[] = [];

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
        this.customers[this.customerIndex];
    }

    private genCustomers(): void {
        const customerNode = instantiate(this.customerPrefab[0]);
        let customer: Customer | null = null;

        if (this.customerIndex % 2 == 0) customer = customerNode.addComponent(TroubleCustomers);
        else customer = customerNode.addComponent(NormalCustomers);

        if (customer) {
            const targetPoint = this.customerIndex == 0 ? Point.OrderPoint : Point.SpawnPoint;
            const pos = this.listPoint[targetPoint].position;
            customer.init(this.customerParentNode, pos);
            this.customers.push(customer);
        }
    }
}


enum Point{
    SpawnPoint = 0,
    MidPoint = 1,
    OrderPoint = 2,
    ExitPoint = 3,
    DestroyPoint = 4,
}