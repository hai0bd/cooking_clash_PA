import { _decorator, Component, MeshRenderer, Node } from 'cc';
import { GameManager } from '../../Core/GameManager';
const { ccclass, property } = _decorator;

@ccclass('Display')
export class Display extends Component {
    @property(MeshRenderer)
    mesh: MeshRenderer = null;

    @property(Node)
    startPos: Node = null;

    protected onEnable(): void {
        GameManager.instance.playerCtrl.targetMesh.push(this.mesh);
    }
}


