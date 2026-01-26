/* import { _decorator, Component, Node, Input, input, Size, screen, EventTouch, Vec3, UITransform } from 'cc';
import super_html_playable from './super_html/super_html_playable';
import { ESound,AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('TouchCanvas')
export class TouchCanvas extends Component {

    private _UITransform: UITransform = null!;
    private _touchLocation: Vec3 = new Vec3();
    private _currentCanvasSize: Size = null!;
    private _hasInteracted: boolean = false; // Biến cờ kiểm tra tương tác

    protected onLoad(): void {
        window.gameReady && window.gameReady();
        super_html_playable.set_google_play_url("https://play.google.com/store/apps/details?id=com.m.cooking.free.chefmaster");
        super_html_playable.set_app_store_url("https://play.google.com/store/apps/details?id=com.m.cooking.free.chefmaster");
        this._UITransform = this.getComponent(UITransform);
        this.updateCanvasSize();
    }

    protected start(): void {
    }


    public updateCanvasSize(): void {
        let canvasSize = screen.windowSize;
        this._currentCanvasSize = canvasSize;
        if (this._currentCanvasSize.width > this._currentCanvasSize.height) {
            console.log("Landscape");
        } else {
            console.log("Portrait");
        }
    }

    protected update(deltaTime: number): void {
        let canvasSize = screen.windowSize;
        if (this._currentCanvasSize && canvasSize.equals(this._currentCanvasSize) == false) {
            this._currentCanvasSize = canvasSize;
            this.updateCanvasSize();
        }
    }
    
    private clickStore() {
         AudioManager.instance.playSound(ESound.Click, 0, 1, false);
        window.gameEnd && window.gameEnd();
        super_html_playable.download();
    }
} */