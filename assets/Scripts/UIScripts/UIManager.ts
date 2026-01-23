import { _decorator, Component, Node, Sprite, UIOpacity, UITransform } from 'cc';
import { GameManager } from '../Core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static _instance: UIManager;

    @property(UIOpacity)
    warningScreen: UIOpacity = null;

    @property(UITransform)
    canvas: UITransform = null;

    public static get instance(): UIManager {
        if (!this._instance) {
            this._instance = new UIManager;
        }
        return this._instance;
    }

    onLoad() {
        if (!UIManager._instance) {
            UIManager._instance = this;
        } else {
            this.destroy();
        }
    }

    start(){
        console.log(this.canvas.contentSize);
    }
}


