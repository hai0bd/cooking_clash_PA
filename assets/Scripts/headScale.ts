/* // Thêm Quat vào dòng import
import { _decorator, Component, Node, Camera, Vec3, Quat } from "cc";

const { ccclass, property } = _decorator;

@ccclass("HeadScale")
export class HeadScale extends Component {
    @property(Node)
    target: Node = null!;
    @property(Camera)
    camera: Camera = null!;
    @property
    distance = 0;

    private _pos: Vec3 = new Vec3();
    
    // Các biến để kiểm tra sự thay đổi
    private _lastTargetWPos: Vec3 = new Vec3();
    private _lastCameraWPos: Vec3 = new Vec3();
    private _lastCameraWRot: Quat = new Quat();

    update() {
        if (!this.camera || !this.camera.node) {
            return;
        }

        const targetWPos = this.target.worldPosition;
        const cameraWPos = this.camera.node.worldPosition;
        const cameraWRot = this.camera.node.worldRotation;
        if (
            this._lastTargetWPos.equals(targetWPos) &&
            this._lastCameraWPos.equals(cameraWPos) &&
            this._lastCameraWRot.equals(cameraWRot)
        ) {
            return;
        }

        // Cập nhật lại các giá trị "cuối cùng" cho frame sau
        this._lastTargetWPos.set(targetWPos);
        this._lastCameraWPos.set(cameraWPos);
        this._lastCameraWRot.set(cameraWRot);
        
        // Phần còn lại của logic giữ nguyên
        const camera = this.camera!;
        // @ts-ignore
        camera._camera.update();
        camera.convertToUINode(targetWPos, this.node.parent!, this._pos);
        this.node.setPosition(this._pos);
        // @ts-ignore
        Vec3.transformMat4(this._pos, targetWPos, camera._camera!.matView);

        const ratio = this.distance / Math.abs(this._pos.z);
        const value = Math.floor(ratio * 100) / 100;
        this.node.setScale(value, value, 1);
    }
} */