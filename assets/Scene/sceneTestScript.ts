import { _decorator, Button, CCString, Component, Node, SkeletalAnimation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('sceneTestScript')
export class sceneTestScript extends Component {
    @property(Button)
    btn: Button = null;

    @property(SkeletalAnimation)
    anim: SkeletalAnimation = null;

    @property(CCString)
    animName: string[] = [];

    clickCount: number = 0;

    onClickButton(){
        this.clickCount++;
        this.anim.play(this.animName[this.clickCount % 2]);
    }
}


