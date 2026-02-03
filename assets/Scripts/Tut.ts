import { _decorator, Camera, Component, director, Label, Node, sp, tween, UITransform, Vec3 } from 'cc';
import { Order } from './Actor/Order/OrderService';
import { recipe } from './Actor/Order/FoodRecipe';
import { EventUI } from './Core/Event';
import { OrderType } from './Core/Enum';
const { ccclass, property } = _decorator;

@ccclass('Tut')
export class Tut extends Component {
    @property(Node)
    ingredient: Node[] = [];

    @property(sp.Skeleton)
    anim: sp.Skeleton = null;

    @property(Camera)
    camera: Camera = null;

    @property(UITransform)
    uiTransform: UITransform = null;

    @property(Label)
    tutLabel: Label = null;

    private currentOrder: Order;
    private currentStep: number = 0;

    start() {
        director.on(EventUI.NEXT_TUT, this.nextTut, this);
    }

    onDestroy() {
        director.off(EventUI.NEXT_TUT);
    }

    nextTut() {
        const steps = recipe[this.currentOrder.name];
        this.currentStep++;
        this.anim.clearTracks();
        if (this.currentStep >= steps.length) {
            this.anim.enabled = false;
            this.tutLabel.string = "";
            return;
        }
        this.tutLabel.string = steps[this.currentStep].describe;
        for (let i = 0; i < this.ingredient.length; i++) {
            if (this.ingredient[i].layer == steps[this.currentStep].step) {
                console.log(this.ingredient[i].name);
                this.moveHand(this.ingredient[i]);
                break;
            }
        }
    }

    customerOrder(order: Order) {
        this.currentOrder = order;
        this.currentStep = 0;
        this.anim.enabled = true;
        const steps = recipe[order.name];

        this.tutLabel.string = steps[this.currentStep].describe;
        for (let i = 0; i < this.ingredient.length; i++) {
            if (this.ingredient[i].layer == steps[this.currentStep].step) {
                this.moveHand(this.ingredient[i]);
                break;
            }
        }
    }


    moveHand(target: Node) {
        const targetWorldPos = target.getWorldPosition();
        let tempPos = new Vec3();

        this.camera.convertToUINode(targetWorldPos, this.uiTransform.node, tempPos);
        // this.node.setPosition(tempPos);

        tween(this.node)
            .to(0.5, tempPos)
            .call(() => {
                this.anim.setAnimation(0, "tap");
            })
            .start();
    }
}


