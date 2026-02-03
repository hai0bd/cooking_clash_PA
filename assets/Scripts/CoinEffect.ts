import { _decorator, Camera, CCInteger, Component, easing, geometry, instantiate, Node, Prefab, randomRange, SkeletalAnimation, tween, UITransform, Vec3, view } from 'cc';
import { OrderManager } from './Actor/Order/OrderManager';
import { UIManager } from './UIScripts/UIManager';
const { ccclass, property } = _decorator;

@ccclass('CoinEffect')
export class CoinEffect extends Component {
    @property(Prefab)
    coin: Prefab = null;

    @property(Node)
    table: Node = null;

    @property(UITransform)
    coinBox: UITransform = null;

    @property(Camera)
    camUI: Camera = null;

    @property(Camera)
    cam3D: Camera = null;

    @property(CCInteger)
    private coinAmount: number = 30;

    private listCoin: Node[] = [];
    private posInit: Vec3;

    start() {
        this.spawnCoins();
    }

    spawnCoins() {
        for (let i = 0; i < this.coinAmount; i++) {
            this.listCoin.push(instantiate(this.coin));
            this.node.addChild(this.listCoin[i]);
        }
        this.posInit = this.listCoin[0].getPosition();
    }

    customerPurchase(hand: Node) {
        const screenPos = this.coinBox.convertToWorldSpaceAR(Vec3.ZERO);
        const screenPoint = new Vec3();
        this.camUI.worldToScreen(screenPos, screenPoint);

        const ray = new geometry.Ray();
        this.cam3D.screenPointToRay(screenPoint.x, screenPoint.y, ray);
        const DIST = 1; // khoảng cách từ camera

        const worldTargetPos = new Vec3(
            ray.o.x + ray.d.x * DIST,
            ray.o.y + ray.d.y * DIST,
            ray.o.z + ray.d.z * DIST
        );

        this.scheduleOnce(() => {
            this.paying(this.table.getWorldPosition(), worldTargetPos, hand);
        }, 0.5);

    }

    paying( tablePos: Vec3, coinBoxWorldPos: Vec3, hand: Node) {
        for (let i = 0; i < this.coinAmount; i++) {
            this.scheduleOnce(() => {
                const startHandPos = hand.getWorldPosition();
                this.listCoin[i].setWorldPosition(startHandPos);
                const startPos = this.listCoin[i].getPosition();
                const endPos = new Vec3(tablePos.x + randomRange(-0.05, 0.05), tablePos.y, tablePos.z + randomRange(-0.05, 0.05));
                
                this.listCoin[i].active = true;
                this.tweenCoin(this.listCoin[i], startPos, endPos, 45);
            }, i * 0.1);
        }
        this.scheduleOnce(() => {
            for (let i = 0; i < this.coinAmount; i++) {
                this.scheduleOnce(() => {
                    const startPos = this.listCoin[i].getPosition();
                    const endPos = new Vec3(coinBoxWorldPos.x + randomRange(-0.1, 0.1), coinBoxWorldPos.y, coinBoxWorldPos.z + randomRange(-0.1, 0.1));

                    this.tweenCoin(this.listCoin[i], startPos, endPos, 0, true);
                }, i * 0.1);
            }
            UIManager.instance.addCoin(10);
        }, this.coinAmount * 0.1 + 3);
    }

    tweenCoin(coin: Node, startPos: Vec3, endPos: Vec3, radian, isDone: boolean = false) {
        const currentPos = new Vec3();
        const midPos = new Vec3((startPos.x + endPos.x) / 2, (startPos.y + endPos.y) / 2);
        const distance = Vec3.distance(midPos, endPos) / 2;
        const controlPoint = new Vec3(
            midPos.x + distance * Math.cos(radian),
            midPos.y + distance * Math.sin(radian)
        )

        tween(coin)
            .to(distance / this.coinAmount, {}, {
                onUpdate: (target: Node, ratio: number) => {
                    this.quadraticBezier(currentPos, startPos, controlPoint, endPos, ratio);
                    target.setPosition(currentPos);
                }
            })
            .call(() => {
                if (isDone) {
                    coin.setPosition(this.posInit);
                    coin.active = false;
                }
            })
            .start();
    }
    // Hàm tính toán điểm trên đường cong Bézier bậc hai
    quadraticBezier(out: Vec3, a: Vec3, b: Vec3, c: Vec3, t: number) {
        const tt = 1 - t;
        out.x = tt * tt * a.x + 2 * t * tt * b.x + t * t * c.x;
        out.y = tt * tt * a.y + 2 * t * tt * b.y + t * t * c.y;
        out.z = tt * tt * a.z + 2 * t * tt * b.z + t * t * c.z;
        return out;
    }
}
