import { _decorator, Component, v3, RigidBody, Vec3, Collider, ICollisionEvent, AudioSource, CameraComponent, input, Input, EventTouch, math } from 'cc';
const { ccclass, property } = _decorator;

let dtime = 0;
let TimeEx = {
    get deltaTime(): number { return dtime; },
    set deltaTime(dt: number) { dtime = dt },
    WaitForSeconds: async (delay) => {
        return await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, delay * 1000);
        });
    }
}
const v3_1 = v3(); 

@ccclass('CharacterController')
export class CharacterController extends Component {

    @property
    velocity = 1.0;

    @property(CameraComponent)
    public camera: CameraComponent = null!;

    // Các biến điều khiển nhân vật
    _rigidBody: RigidBody;
    _isMoving: boolean = false;
    _velocityScale: number = 1.0;
    _isInTheAir: boolean = false;
    _curentVerticalVelocity: number = 0.0;
    _audioSource: AudioSource = null!;
    public static instance: CharacterController = null!;
    private _isEndGame: boolean = false;
    private _temp: boolean = false;

    // Các biến xoay Camera
    private _yCameraSpeed: number = 0.0005;
    private _xCameraSpeed: number = 0.0005;
    private _cameraYVelocity: number[] = [0];
    private _cameraXVelocity: number[] = [0];
    private _mouseSensitivity: number = 0.15;
    private _limitTopY: number = 10;
    private _limitBottomY: number = -10;
    private _limitLeftX: number = 20;
    private _limitRightX: number = -20;
    private _preAngleX: number = 0;
    private _preAngleY: number = 0;
    private _angleX: number = 0;
    private _angleY: number = 0;

    // Các biến điều khiển chạm
    public holdHandTouchStart: boolean = true;
    private _firstTouch: boolean = true;
    protected onLoad(): void {
        CharacterController.instance = this;
    }
    protected onEnable(): void {
        this._audioSource = this.getComponent(AudioSource);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    protected onDisable(): void {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
    }
    protected onTouchStart(event: EventTouch): void {
        if (this._firstTouch) {
            this._firstTouch = false;
        }

        this.onTouchMove(event);
        if (this.holdHandTouchStart) {
            this.holdHandTouchStart = false;
        }
    }
    protected onTouchMove(event: EventTouch): void {
        this._preAngleX += -event.getDeltaY() * this._mouseSensitivity;
        this._preAngleY += -event.getDeltaX() * this._mouseSensitivity;
        this._preAngleX = math.clamp(this._preAngleX, this._limitBottomY, this._limitTopY);
        this._preAngleY = math.clamp(this._preAngleY, this._limitLeftX, this._limitRightX);
    }
    protected onTouchEnd(event: EventTouch): void {
        this.holdHandTouchStart = true;
    }

    start() {
        this._rigidBody = this.node.getComponent(RigidBody);
        let myCollider = this.getComponent(Collider);
        myCollider.on('onCollisionEnter', (target: ICollisionEvent) => {
            if (target.otherCollider != target.selfCollider) {
                this.onLand();
            }
        });
    }

    onDestroy() {
        this._audioSource.stop();
        this._rigidBody.setLinearVelocity(Vec3.ZERO);
        this._isEndGame = true;
    }

    update(deltaTime: number) {
        if (this._isEndGame) return;
        
        if (this._isMoving) {
            const tmp_v3 = v3();
            tmp_v3.multiplyScalar(this.velocity * this._velocityScale);

            if (this._rigidBody) {
                this._rigidBody.getLinearVelocity(v3_1);
                tmp_v3.y = v3_1.y;
                this._rigidBody.setLinearVelocity(tmp_v3);
            } else {
                tmp_v3.multiplyScalar(deltaTime);
                tmp_v3.add(this.node.position);
                this.node.setPosition(tmp_v3);
            }
        }

        if (this._isInTheAir) {
            if (!this._rigidBody) {
                this._curentVerticalVelocity -= 9.8 * deltaTime;
                let oldPos = this.node.position;
                let nextY = oldPos.y + this._curentVerticalVelocity * deltaTime;
                if (nextY <= 0) {
                    this.onLand();
                    nextY = 0.0;
                }
                this.node.setPosition(oldPos.x, nextY, oldPos.z);
            }
        }
    }

    onLand() {
        this._isInTheAir = false;
        this._curentVerticalVelocity = 0.0;
    }

   onMovement(degree: number, offset: number) {
        if (!this._temp) {
            this._audioSource.play();
            this._audioSource.loop = true;
            this._temp = true;
        }
        this._velocityScale = offset;

        // 1. Lấy và làm phẳng vector forward
        const forward = v3(this.camera.node.forward);
        forward.y = 0;
        forward.normalize();

        // 2. Lấy vector right
        const right = v3(this.camera.node.right);
        
        // 3. Tính toán hướng di chuyển
        const radian = (degree) * Math.PI / 180;
        const joystickX = Math.cos(radian);
        const joystickY = Math.sin(radian);

        const moveDir = v3();
        
        // Sửa lại cách gọi: dùng Vec3 thay vì v3
        Vec3.scaleAndAdd(moveDir, moveDir, forward, joystickY);
        Vec3.scaleAndAdd(moveDir, moveDir, right, joystickX);

        this._isMoving = true;
    }

    onMovementRelease() {
        this._audioSource.stop();
        this._temp = false;
        this._isMoving = false;
        if (this._rigidBody) {
            this._rigidBody.setLinearVelocity(Vec3.ZERO);
        }
    }

    private applyRotation(): void {
        this._angleY = this.SmoothDamp(this._angleY, this._preAngleY, this._cameraYVelocity, this._yCameraSpeed);
        this._angleX = this.SmoothDamp(this._angleX, this._preAngleX, this._cameraXVelocity, this._xCameraSpeed);
        this.camera.node.setRotationFromEuler(-this._angleX, this._angleY, 0);
    }

    protected lateUpdate(): void {
        this.applyRotation();
    }
    private SmoothDamp(current: number, target: number, currentVelocity: number[], smoothTime: number, maxSpeed: number = Infinity, deltaTime: number = TimeEx.deltaTime): number {
        deltaTime = Math.max(0.0001, deltaTime);
        smoothTime = Math.max(0.0001, smoothTime);
        let omega = 2 / smoothTime;
        let x = omega * deltaTime;
        let exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
        let change = current - target;
        let originalTo = target;
        let maxChange = maxSpeed * smoothTime;
        change = math.clamp(change, -maxChange, maxChange);
        target = current - change;
        let temp = (currentVelocity[0] + omega * change) * deltaTime;
        currentVelocity[0] = (currentVelocity[0] - omega * temp) * exp;
        let result = target + (change + temp) * exp;
        if (originalTo - current > 0.0 == result > originalTo) {
            result = originalTo;
            currentVelocity[0] = (result - originalTo) / deltaTime;
        }
        return result;
    }
}