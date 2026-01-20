import { _decorator, Component, Node, tween, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    /* start() {

    }

    update(deltaTime: number) {
        
    } */

    moveToTarget(targetPos: Vec3, foodPos: Node): void {
        // this.node.setPosition(targetPosition.getPosition());
        tween(this.node)
        .to(0.5, { position: foodPos.getPosition() })
        .call(() => {
            this.node.setParent(foodPos.getParent());
            if(targetPos){
                tween(foodPos)
                .to(0.5, { position: targetPos  })
                .call(() => {
                    foodPos.destroy();
                })
                .start();
            }
        })
        .start();
    }

    /* followTarget(targetParentNode: Node ): void {
        tween(this.node)
        .to(0.5, { position: targetParentNode.getPosition() })
        .call(() => {
            if()
            this.node.setParent(targetParentNode);
        })
        .start();
        
    } */
}