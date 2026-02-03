import { _decorator, Component, easing, instantiate, Label, Node, Prefab, Sprite, SpriteFrame, tween, UIOpacity, Vec3 } from 'cc';
import { GameManager } from '../Core/GameManager';
import { GameState } from '../Core/Enum';
import { OrderManager } from '../Actor/Order/OrderManager';
const { ccclass, property } = _decorator;

@ccclass('PopupOrder')
export class PopupOrder extends Component {
    @property({ group: "Sprite", type: Sprite })
    private popupBG: Sprite = null;

    @property({ group: "Sprite", type: Sprite })
    private remainingTime: Sprite = null;

    @property({ group: "Sprite", type: Sprite })
    private foodSprite: Sprite = null;

    @property({ group: "Sprite", type: SpriteFrame })
    private bgFood: SpriteFrame = null;

    @property({ group: "Sprite", type: SpriteFrame })
    private bgBoom: SpriteFrame = null;

    @property({ group: "Active Node", type: Node })
    private foodNode: Node = null;

    @property({ group: "Active Node", type: Node })
    private boomNode: Node = null;

    @property({ group: "Label", type: Label })
    private foodAmount: Label = null;

    @property({ group: "Label", type: Label })
    private troubleCusLabel: Label = null;

    @property(UIOpacity)
    private warningScreen: UIOpacity = null;

    @property(Node)
    layoutStep: Node = null;

    @property(Prefab)
    stepPrefab: Prefab = null;

    private _isClose: boolean = true;
    private listStep: Node[] = [];

    orderFood(spriteFr: SpriteFrame, recipe: SpriteFrame[]) {
        if (this._isClose) {
            this.openPopup(false);
            this.bounceNode(Vec3.ZERO, Vec3.ONE, this.popupBG.node, this.foodSprite.node, this.foodAmount.node)

            this.popupBG.spriteFrame = this.bgFood;
            this.foodSprite.spriteFrame = spriteFr;

            this.setRecipe(recipe);
            // this.foodAmount.string = amount;
            this.countdown(20);
        }
    }

    setRecipe(recipe: SpriteFrame[]) {
        for (let i = 0; i < recipe.length; i++) {
            const step = instantiate(this.stepPrefab);
            this.layoutStep.addChild(step);
            step.getComponent(Sprite).spriteFrame = recipe[i];
            this.listStep.push(step);
        }
        this.scheduleOnce(() => { this.bounceNode(Vec3.ZERO, new Vec3(0.3, 0.3, 1), ...this.listStep); })
    }

    orderBoom(lines: string) {
        if (this._isClose) {
            this.openPopup(true);
            this.bounceNode(Vec3.ZERO, Vec3.ONE, this.popupBG.node);

            this.popupBG.spriteFrame = this.bgBoom;
            this.troubleCusLabel.string = lines;
        }
    }

    countdown(time: number) {
        this.remainingTime.fillRange = 1;
        tween(this.remainingTime)
            .to(time * 0.7, { fillRange: 0.3 })
            .call(() => {
                const flashWarn = this.flashTween();

                tween(this.remainingTime)
                    .to(time * 0.3, { fillRange: 0 })
                    .call(() => {
                        this.closed();
                        flashWarn.stop();
                        this.warningScreen.node.active = false;
                        GameManager.instance.changeState(GameState.TIME_OUT);
                        OrderManager.instance.orderFailed();
                    })
                    .start();
            })
            .start();
    }

    flashTween() {
        this.warningScreen.node.active = true;
        return tween(this.warningScreen)
            .to(0.3, { opacity: 255 }, { easing: 'sineInOut' }) // Hiện lên
            .to(0.3, { opacity: 0 }, { easing: 'sineInOut' })            // Mờ đi
            .union()            // Gộp các bước trên thành một khối
            .repeatForever()    // Lặp lại vô hạn
            .start();
    }

    openPopup(isBoom: boolean) {
        this._isClose = false;
        this.foodNode.active = !isBoom;
        this.boomNode.active = isBoom;
        this.popupBG.node.active = true;
    }

    closed() {
        if (!this._isClose) {
            this._isClose = true;
            const startScale = 1;
            const endScale = 0;

            this.popupBG.node.setScale(new Vec3(startScale, startScale, startScale));
            tween(this.popupBG.node)
                .to(1, { scale: new Vec3(endScale, endScale, endScale) }, { easing: 'backIn' })
                .call(() => {
                    if (this.listStep.length > 0) {
                        for (let i = 0; i < this.listStep.length; i++) {
                            this.listStep[i].destroy();
                            this.listStep[i] = null;
                        }
                        this.listStep = [];
                    }
                    this.popupBG.node.active = false;
                })
                .start();
        }
    }

    bounceNode(startScale: Vec3, endScale: Vec3, ...nodes: Node[]) {
        const midScale = new Vec3(endScale.x + 0.2, endScale.y + 0.2, endScale.z + 0.2);
        nodes.forEach((node, index) => {
            node.setScale(startScale);
            tween(node)
                .delay(index * 0.2)
                .to(0.5, { scale: midScale })
                .call(() => {
                    tween(node).to(0.1, { scale: endScale }).start();
                })
                .start();
        });
    }
}


