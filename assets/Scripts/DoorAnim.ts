import { _decorator, Component, director, Node, tween, Vec3 } from 'cc';
import { GameEvent } from './Core/Event';
const { ccclass, property } = _decorator;

@ccclass('DoorAnim')
export class DoorAnim extends Component {
    @property(Node)
    leftDoor: Node = null;

    @property(Node)
    rightDoor: Node = null;

    private offsetX = 1.3;

    protected onLoad(): void {
        director.on(GameEvent.OPEN_DOOR, this.openDoor, this);
    }

    protected onDestroy(): void {
        director.off(GameEvent.OPEN_DOOR, this.openDoor, this);
    }

    private openDoor() {
        tween(this.leftDoor)
            .to(0.5, { position: new Vec3(this.leftDoor.position.x - this.offsetX, this.leftDoor.position.y, this.leftDoor.position.z) })
            .start();
        tween(this.rightDoor)
            .to(0.5, { position: new Vec3(this.rightDoor.position.x + this.offsetX, this.rightDoor.position.y, this.rightDoor.position.z) })
            .call(() => {
                this.scheduleOnce(() => {
                    this.closeDoor();
                }, 0.5);
            })
            .start();
    }

    private closeDoor() {
        tween(this.leftDoor)
            .to(0.5, { position: new Vec3(this.leftDoor.position.x + this.offsetX, this.leftDoor.position.y, this.leftDoor.position.z) })
            .start();
        tween(this.rightDoor)
            .to(0.5, { position: new Vec3(this.rightDoor.position.x - this.offsetX, this.rightDoor.position.y, this.rightDoor.position.z) })
            .start();
    }
}


