import { _decorator, Camera, Component, EventTouch, geometry, Input, input, instantiate, MeshRenderer, Node, SkeletalAnimation, tween, Vec3 } from 'cc';
import { OrderManager } from './Order/OrderManager';
import { GameState } from '../Core/Enum';
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
    cuttingBoard: Node = null;

    @property(Node)
    handSocket: Node = null;

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
        if (!GameManager.instance.isState(GameState.SERVE)) return;
        const touchPos = event.getLocation();
        this.mainCam.screenPointToRay(touchPos.x, touchPos.y, this.ray);

        for (const mesh of this.targetMesh) {
            // this.targetMesh.forEach(mesh => {
            if (mesh && mesh.model) {
                const boundingBox = mesh.model.worldBounds;

                if (geometry.intersect.rayAABB(this.ray, boundingBox)) {
                    const orderType = mesh.node.layer;
                    const checkAction = OrderManager.instance.checkAction(orderType, mesh.node);
                    break;
                }
            }
        }
    }
    private startHandPos: Vec3;
    moveToIngredient(node: Node) {
        const hand = this.handAnim.node;
        this.startHandPos = this.handAnim.node.getPosition().clone();

        hand.active = true;
        hand.setPosition(this.startHandPos);
        tween(hand)
            .to(.5, { worldPosition: node.getWorldPosition() })
            .call(() => {
                this.handAnim.play("picked");
                this.handAnim.once(SkeletalAnimation.EventType.FINISHED, () => {
                    this.takeIngredient(node);
                    /* tween(node)
                        .to(1, { worldPosition: this.cuttingBoard.getWorldPosition() })
                        .start(); */
                });
            })
            .start();

    }

    takeIngredient(ingredient: Node) {
        const cloneIngredient = instantiate(ingredient);
        const quat = ingredient.getWorldRotation();
        cloneIngredient.setParent(this.handSocket);
        cloneIngredient.setWorldRotation(quat);
        tween(this.handAnim.node)
            .to(0.5, { worldPosition: this.cuttingBoard.getWorldPosition() })
            .start();
    }
}