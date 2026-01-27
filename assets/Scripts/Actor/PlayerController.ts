import { _decorator, Camera, Component, Enum, EventTouch, geometry, Input, input, instantiate, MeshRenderer, Node, PhysicsRayResult, PhysicsSystem, Quat, SkeletalAnimation, tween, Vec3 } from 'cc';
import { OrderManager } from './Order/OrderManager';
import { GameState, OrderCategory } from '../Core/Enum';
import { GameManager } from '../Core/GameManager';
import { isPortrait } from '../UIScripts/responsive';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Node)
    landscapeCam: Node = null;

    @property(Camera)
    mainCam: Camera = null;

    @property(MeshRenderer)
    targetMesh: MeshRenderer[] = [];

    @property(SkeletalAnimation)
    handAnim: SkeletalAnimation = null;

    @property(Node)
    handSocket: Node = null;

    @property(Node)
    customerNode: Node = null;

    private ray: geometry.Ray = new geometry.Ray();
    private playerHandler: MeshRenderer = null;

    onLoad() {
        // input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchStart, this);
        // input.on(Input.EventType.TOUCH_CANCEL, this.onTouchStart, this);
        if (!isPortrait()) {
            this.mainCam.node.setPosition(this.landscapeCam.getPosition());
            this.mainCam.node.setRotation(this.landscapeCam.getRotation());
            this.mainCam.fov = 71;
        }
    }

    onTouchStart(event: EventTouch): void {
        if (GameManager.instance.isState(GameState.SERVE)) {
            const touchPos = event.getLocation();
            this.mainCam.screenPointToRay(touchPos.x, touchPos.y, this.ray);

            for (const mesh of this.targetMesh) {
                // this.targetMesh.forEach(mesh => {
                if (mesh && mesh.model) {
                    const boundingBox = mesh.model.worldBounds;

                    if (geometry.intersect.rayAABB(this.ray, boundingBox)) {
                        const orderType = mesh.node.layer;
                        // check food == customer order?
                        const category = OrderManager.instance.verifyOrder(orderType, mesh.node);
                        if (category != null) {
                            // check category food:
                            // #drink: dua luon
                            if (category == OrderCategory.DRINK)
                                this.moveToTarget(this.customerNode, mesh.node, this.handAnim.node);
                            // #eat: dat ra dia
                            else if (category == OrderCategory.EAT) {
                                this.moveToTarget(this.customerNode, mesh.node, this.handAnim.node);
                            }
                            // #throw: tween nem ra
                            else if (category == OrderCategory.THROW) {
                                this.throwToTarget(mesh.node);
                            }
                        }

                        //xu li va cham
                        if (this.playerHandler === mesh) {
                            this.playerHandler = null;
                            // GameManager.instance.serveOrder(orderType);
                        }
                        else {
                            this.playerHandler = mesh;
                        }
                        break;
                    }
                }
            }

        }
    }

    moveToTarget(target: Node, food: Node, playerHand: Node): void {
        const targetPos = target.getWorldPosition();
        const foodPos = food.getWorldPosition();
        this.handAnim.play("picked");
        playerHand.setParent(food);
        playerHand.setWorldPosition(new Vec3(foodPos.x, foodPos.y, foodPos.z + 0.2));

        tween(food)
            .to(0.2, { worldPosition: new Vec3(targetPos.x, 1, targetPos.z) })
            .call(() => {
                food.setWorldPosition(foodPos);
                playerHand.active = false;
                playerHand.setParent(this.node);
                playerHand.active = true;
            })
            .start();
    }

    throwToTarget(throwNode: Node) {
        this.handAnim.node.active = true;
        this.handAnim.node.setPosition(Vec3.ZERO);
        this.handAnim.node.setRotation(Quat.IDENTITY);

        const node = instantiate(throwNode);
        node.setParent(this.handSocket);
        node.setPosition(new Vec3(-0.05, 0.03, 0.03));
        node.setRotationFromEuler(new Vec3(0, 0, -100));
        // node.setScale(new Vec3(100, 100, 100));

        this.handAnim.play("throw");
        const targetPos = this.customerNode.getWorldPosition();
        this.scheduleOnce(() => {
            tween(node)
                .to(0.2, { worldPosition: new Vec3(targetPos.x, 1, targetPos.z) })
                .call(() => {
                    node.destroy();
                    this.handAnim.node.active = false;
                })
                .start();
        }, 0.5);

    }
}