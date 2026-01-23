import { _decorator, Camera, Component, EventTouch, geometry, Input, input, MeshRenderer, Node, PhysicsRayResult, PhysicsSystem, SkeletalAnimation, tween, Vec3 } from 'cc';
import { OrderManager } from './Order/OrderManager';
import { GameState, OrderCategory } from '../Core/Enum';
import { GameManager } from '../Core/GameManager';
import { isPortrait } from '../UIScripts/responsive';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    @property(Camera)
    mainCamera: Camera = null;

    @property(Node)
    potCam: Node = null;

    @property(MeshRenderer)
    targetMesh: MeshRenderer[] = [];

    @property(SkeletalAnimation)
    handAnim: SkeletalAnimation = null;

    @property(Node)
    customerNode: Node = null;

    private ray: geometry.Ray = new geometry.Ray();
    private playerHandler: MeshRenderer = null;

    start() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        if(isPortrait()){
            this.mainCamera.node.setPosition(this.potCam.getPosition());
            this.mainCamera.node.setRotation(this.potCam.getRotation());
            this.mainCamera.fov = 130;
        }
    }

    onTouchStart(event: EventTouch): void {
        if (GameManager.instance.isState(GameState.SERVE)) {
            const touchPos = event.getLocation();
            this.mainCamera.screenPointToRay(touchPos.x, touchPos.y, this.ray);

            this.targetMesh.forEach(mesh => {
                if (mesh && mesh.model) {
                    const boundingBox = mesh.model.worldBounds;

                    if (geometry.intersect.rayAABB(this.ray, boundingBox)) {
                        const orderType = mesh.node.layer;
                        // check food == customer order?
                        const category = OrderManager.instance.verifyOrder(orderType, mesh.node);
                        if (category) {
                            // check category food:
                            // #drink: dua luon
                            if (category == OrderCategory.DRINK) this.moveToTarget(this.customerNode, mesh.node, this.handAnim.node);

                            // #eat: dat ra dia

                            // #throw: tween nem ra
                            else if (category == OrderCategory.THROW) {
                                tween(this.handAnim.node)
                                .to(0.1, {worldPosition: mesh.node.getWorldPosition()})
                                .start();
                                this.handAnim.play("throw");
                            }
                            else {

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
                    }
                }
            });

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