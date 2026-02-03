import { _decorator, Camera, CCInteger, Component, Enum, instantiate, Node, Prefab, Vec3 } from 'cc';
import { PlayerController } from '../Actor/PlayerController';
import { OrderManager } from '../Actor/Order/OrderManager';
import { CustomerSpawner } from '../Actor/Customer/CustomerSpawner';
import { GameState } from './Enum';
import { UIManager } from '../UIScripts/UIManager';
import super_html_playable from '../super_html/super_html_playable';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    private static _instance: GameManager;

    @property(PlayerController)
    playerCtrl: PlayerController = null;

    @property(CustomerSpawner)
    customerSpawner: CustomerSpawner = null;

    @property(Node)
    public listPoint: Node[] = [];

    public score: number = 0;
    @property({ type: Enum(GameState) })
    public state: GameState;

    public static get instance(): GameManager {
        if (!this._instance) {
            // this._instance = new GameManager();
            console.warn("Chua co instance cua GameManager");
        }
        return this._instance;
    }

    onLoad() {
        if (!GameManager._instance) {
            GameManager._instance = this;
        } else {
            this.destroy();
        }

        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.m.cooking.free.chefmaster");
        super_html_playable.set_app_store_url("https://play.google.com/store/apps/details?id=com.m.cooking.free.chefmaster");
    }

    start() {
        this.state = GameState.START;
        OrderManager.instance.listPoint = this.listPoint;
        this.customerSpawner.init(this.listPoint);
    }

    isState(state: GameState): boolean {
        return this.state === state
    }

    changeState(newState: GameState) {
        if (this.state == newState) return;
        this.state = newState;

        switch (newState) {
            case GameState.START:
                break;
            case GameState.SERVE:
                // OrderManager.instance.
                break;
            case GameState.WAIT_NEXT_CUSTOMER:

                break;
            case GameState.TIME_OUT:
                break;
            case GameState.END:
                UIManager.instance.visibleStore();
                this.goToStore();
                break;
        }
    }
    goToStore() {
        console.log("Download to play next level");
        super_html_playable.download();
    }

    NextCustomer() {
        this.customerSpawner.nextCustomer();
        this.score += 10;
    }
}
