import { _decorator, Component, Vec3, v3, macro, misc, director, Sprite, UI, tween, UIOpacity, Tween } from 'cc';
import { GameEvent } from './Core/Event';
import { UIManager } from './UIScripts/UIManager';
const { ccclass, property } = _decorator;

@ccclass('CameraShake')
export class CameraShake extends Component {
    @property({tooltip: "Số lần rung liên tiếp"})
    times: number = 2;

    @property({ tooltip: "Độ lệch tối đa" })
    strength: number = 10;

    @property({ tooltip: "Thời gian rung" })
    duration: number = 0.5;

    @property({ tooltip: "Số lần dao động" })
    vibrato: number = 10;

    private _originPos: Vec3 = v3();
    private _elapsed: number = 0;
    private _isShaking: boolean = false;
    private warningScreen: UIOpacity = null;
    private flashTween: Tween<UIOpacity> = null;

    onLoad() {
        this.warningScreen = UIManager.instance.warningScreen;
        director.on(GameEvent.CAMERA_SHAKE, this.shake, this);
    }

    // Hàm gọi để bắt đầu rung - Kết quả 100 lần như 1
    public shake() {
        this._isShaking = true;
        this._elapsed = 0;
        // Lưu vị trí hiện tại làm gốc
        Vec3.copy(this._originPos, this.node.position);
        this.warningScreen.node.active = true;
        this.flashTween = tween(this.warningScreen)
                .to(0.5, { opacity: 255 }, { easing: 'sineInOut' }) // Hiện lên
                .to(0.5, { opacity: 0 }, { easing: 'sineInOut' })            // Mờ đi
                .union()            // Gộp các bước trên thành một khối
                .repeatForever()    // Lặp lại vô hạn
                .start();
    }

    update(dt: number) {
        if (!this._isShaking) return;

        this._elapsed += dt;
        let t = this._elapsed / this.duration;

        if (t >= 1) {
            this.stopShake();
            return;
        }

        // 1. Hệ số giảm dần (Easing Out)
        // Dùng (1-t)^2 để lực rung giảm nhanh lúc đầu và nhẹ dần về sau (rất thật)
        let decay = Math.pow(1 - t, 2);

        // 2. Tính toán dao động dựa trên hàm Sin
        // Chúng ta dùng các số nguyên tố như 1.0 và 1.3 để trục X và Y không trùng nhịp
        // Điều này tạo ra quỹ đạo rung nhìn "phức tạp" dù không ngẫu nhiên
        let angle = t * this.vibrato * Math.PI * 2;

        let offsetX = Math.sin(angle) * this.strength * decay;
        let offsetY = Math.cos(angle * 1.3) * this.strength * decay;

        // 3. Áp dụng vị trí
        this.node.setPosition(
            this._originPos.x + offsetX,
            this._originPos.y + offsetY,
            this._originPos.z
        );
    }

    private stopShake() {
        this.warningScreen.opacity = 255;
        this.warningScreen.node.active = false;
        this._isShaking = false;
        this.flashTween.stop();
        this.flashTween = null;
        this.node.setPosition(this._originPos);
        this.times--;
        if(this.times >= 0) this.shake();
    }

    onDestroy() {
        director.off(GameEvent.CAMERA_SHAKE);
    }
}