import { _decorator, Camera, Component, EventTouch, geometry, Input, input, MeshRenderer, Node, PhysicsRayResult, PhysicsSystem, SkeletalAnimation, tween, Vec3 } from 'cc';
import { GameManager } from './GameManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Camera)
    mainCamera: Camera = null;

    @property(MeshRenderer)
    targetMesh: MeshRenderer[] = [];

    @property(SkeletalAnimation)
    playerHand: SkeletalAnimation = null;

    @property(Node)
    customerNode: Node = null;

    private ray: geometry.Ray = new geometry.Ray();
    private playerHandler: MeshRenderer = null;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: EventTouch): void {
        const touchPos = event.getLocation();
        this.mainCamera.screenPointToRay(touchPos.x, touchPos.y, this.ray);

        this.targetMesh.forEach(mesh => {
            if (mesh && mesh.model) {
                const boundingBox = mesh.model.worldBounds;

                if (geometry.intersect.rayAABB(this.ray, boundingBox)) {
                    // da va cham voi mesh
                    // console.log("Touched mesh: " + mesh.node.name, "with layer is: " + mesh.node.layer);

                    //cooking and result: inisiate food
                    


                    // di chuyen player den vat the
                    this.moveToTarget(this.customerNode, mesh.node, this.playerHand.node);

                    //xu li va cham
                    const orderType = mesh.node.layer;
                    if (this.playerHandler === mesh) {
                        this.playerHandler = null;
                        GameManager.instance.serveOrder(orderType);
                    }
                    else {
                        this.playerHandler = mesh;
                    }
                }
            }
        });
    }

    moveToTarget(target: Node, food: Node, playerHand: Node): void {
        const targetPos = target.getWorldPosition();
        const foodPos = food.getWorldPosition();
        playerHand.setParent(food);
        playerHand.setWorldPosition(foodPos);

        tween(food)
            .to(2, { position: targetPos })
            .call(() => {
                playerHand.active = false;
            })
            .start();
        // this.node.setPosition(targetPosition.getPosition());
        /* this.playerHand.play("PickedAnimation");
        tween(playerHand)
        .to(2, { position: foodPos.getPosition() })
        .call(() => {
            playerHand.setParent(foodPos.getParent());
            if(targetPos){
                tween(foodPos)
                .to(2, { position: targetPos  })
                .call(() => {
                    playerHand.active = false;
                })
                .start();
            }
        })
        .start(); */
    }
}