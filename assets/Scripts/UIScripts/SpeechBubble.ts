import { _decorator, Camera, CCFloat, Component, Node, Quat, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SpeechBubble')
export class SpeechBubble extends Component {
    @property(Node)
    targetNode: Node = null;

    @property(Camera)
    mainCamera: Camera = null;

    @property(CCFloat)
    distance: number = 5;

    private pos: Vec3 = new Vec3();
    private lastTargetPos: Vec3 = new Vec3();
    private lastCameraPos: Vec3 = new Vec3();
    private lastCameraRot: Quat = new Quat();

    update(deltaTime: number) {
        if (!this.targetNode) return;
        const targetWPos = new Vec3();
        const cameraWPos = this.mainCamera.node.worldPosition;
        const cameraWRot = this.mainCamera.node.worldRotation;
        this.targetNode.getWorldPosition(targetWPos);
        if (
            this.lastTargetPos.equals(targetWPos) &&
            this.lastCameraPos.equals(cameraWPos) &&
            this.lastCameraRot.equals(cameraWRot)
        ) {
            return;
        }

        // Cập nhật lại các giá trị "cuối cùng" cho frame sau
        this.lastTargetPos.set(targetWPos);
        this.lastCameraPos.set(cameraWPos);
        this.lastCameraRot.set(cameraWRot);

        // Phần còn lại của logic giữ nguyên
        const camera = this.mainCamera!;
        // @ts-ignore
        camera._camera.update();
        camera.convertToUINode(targetWPos, this.node.parent!, this.pos);
        this.node.setPosition(this.pos);
        // @ts-ignore
        Vec3.transformMat4(this.pos, targetWPos, camera.camera!.matView);

        /* const ratio = this.distance / Math.abs(this.pos.z);
        const value = Math.floor(ratio * 100) / 100;
        this.node.setScale(value, value, 1); */
    }
}


