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

    @property(Node)
    cuttingBoard: Node = null;

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
}