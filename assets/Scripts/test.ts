import { _decorator, Camera, Component, Node, sp, UITransform } from 'cc';
import { PlayerController } from './Actor/PlayerController';
const { ccclass, property } = _decorator;

@ccclass('test')
export class test extends Component {
    @property(PlayerController)
    player: PlayerController = null;

    @property(sp.Skeleton)
    anim: sp.Skeleton = null;

    @property(Camera)
    camera: Camera = null;

    @property(UITransform)
    uiTransform: UITransform = null;
    start() {

    }

    update(deltaTime: number) {

    }
}


