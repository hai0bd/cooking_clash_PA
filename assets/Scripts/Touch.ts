import { _decorator, Component, systemEvent, SystemEventType, PhysicsSystem, geometry, Camera, Node, Prefab, instantiate, Vec3, tween, BoxCollider, SkeletalAnimation } from 'cc';
import { KitchenTool } from './KitchenTool';
import {ESound,AudioManager } from './AudioManager';

const { ccclass, property } = _decorator;

@ccclass('ClickHandler')
export class ClickHandler extends Component {
    @property(Camera)
    camera: Camera = null;

    @property(KitchenTool)
    kitchenTool: KitchenTool = null;

    @property(Node)
    cupHolderNode: Node = null;

    @property(Node)
    cokeTargetNode: Node = null;

    @property([Node])
    Touch: Node[] = [];

    @property(SkeletalAnimation)
    rabbitAnim: SkeletalAnimation = null;

    @property(Node)
    cupColaRabbit: Node = null;

    @property(BoxCollider)
    colaMachineCollider: BoxCollider = null;

    @property(Node)
    ButtonCfV1: Node = null;

    @property(Node)
    ButtonCfV2: Node = null;

    @property([Node])
    Hand: Node[] = [];

    @property([Node])
    Tap: Node[] = [];

    @property(Node)
    Menu: Node = null;

    @property(Node)
    MenuV2: Node = null;

    @property(Node)
    CTA: Node = null;

    private activeCup: Node | null = null;
    private cupAtMachine: Node | null = null;
    private isFilling: boolean = false;
    private isCupReadyToTake: boolean = false;
    private canServeRabbit: boolean = false;
    private hasPouredAudioPlayed: boolean = false;
    start() {
        systemEvent.on(SystemEventType.TOUCH_START, this.onTouchStart, this);
        this.CTA.active = false;
        // Kích hoạt Hand[0] và Tap[0] ngay lập tức
        if (this.Tap && this.Tap[0]) {
            this.Tap[0].active = true;
        }
        if (this.Hand && this.Hand[0]) {
            this.Hand[0].active = true;
        }

        // Thiết lập trạng thái ban đầu cho Menu và MenuV2
        if (this.Menu) {
            this.Menu.active = true;
        }
        if (this.MenuV2) {
            this.MenuV2.active = false;
        }
           if (this.Hand && this.Hand[5]) {
        this.Hand[5].active = false;
    }
    if (this.Tap && this.Tap[5]) {
        this.Tap[5].active = false;
    }
    }

    onDestroy() {
        systemEvent.off(SystemEventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(event: any) {
        if (!this.camera) { return; }

        const touchLocation = event.getLocation();
        const ray = new geometry.Ray();
        this.camera.screenPointToRay(touchLocation.x, touchLocation.y, ray);

        if (PhysicsSystem.instance.raycast(ray)) {
            const results = PhysicsSystem.instance.raycastResults;
            results.sort((a, b) => a.distance - b.distance);

            if (results.length > 0) {
                 AudioManager.instance.playSound(ESound.Click, 0, 1, false);
                const hitNode = results[0].collider.node;
                // LOGIC 0: Chạm vào ly đã đầy tại máy cola để LẤY LẠI
                if (this.isCupReadyToTake && hitNode === this.cupAtMachine) {
                    console.log('Lấy ly cola đã đầy...');
                    const targetPosition = this.cupHolderNode.getWorldPosition();
                    
                    if (this.Hand && this.Hand[3]) {
                        this.Hand[3].active = false;
                    }
                    if (this.Tap && this.Tap[3]) {
                        this.Tap[3].active = false;
                    }
                    if (this.Hand && this.Hand[4]) {
                        this.Hand[4].active = true;
                    }
                    if (this.Tap && this.Tap[4]) {
                        this.Tap[4].active = true;
                    }

                    tween(this.cupAtMachine)
                        .to(0.5, { worldPosition: targetPosition }, { easing: 'cubicOut' })
                        .call(() => {
                            this.cupAtMachine.setParent(this.cupHolderNode, true);
                            this.activeCup = this.cupAtMachine;
                            this.cupAtMachine = null;
                            this.isCupReadyToTake = false;
                            this.canServeRabbit = true;
                            console.log('Đã di chuyển ly trở lại giá đỡ.');
                            if (this.colaMachineCollider) {
                                this.colaMachineCollider.enabled = true;
                                console.log('Cola Machine Collider ĐÃ BẬT.');
                            }
                        })
                        .start();
                }
                // LOGIC 1: PHỤC VỤ CHO THỎ
                else if (hitNode.name.startsWith('Rabbit') && this.canServeRabbit && this.activeCup) {
                    console.log('Phục vụ nước cho Rabbit!');

                    if (this.rabbitAnim) {
                        this.rabbitAnim.once(SkeletalAnimation.EventType.FINISHED, () => {
                            this.rabbitAnim.once(SkeletalAnimation.EventType.FINISHED, () => {
                                this.rabbitAnim.play('IdleGod');
                                if (this.Menu) {
                                    this.Menu.active = false; // Ẩn Menu đi
                                }
                                if (this.MenuV2) {
                                    this.MenuV2.active = true; // Hiện MenuV2 lên
                                    this.MenuV2.setScale(Vec3.ZERO); 
                                    tween(this.MenuV2)
                                        .to(1.0, { scale: new Vec3(1.2, 1.2, 1.2) }, { easing: 'backOut' })
                                        .start();
                                }
                                if (this.Hand && this.Hand[5]) {
                                    this.Hand[5].active = true;
                                }
                                if (this.Tap && this.Tap[5]) {
                                    this.Tap[5].active = true;
                                }
                                 this.CTA.active = true;
                            });
                            this.rabbitAnim.play('Good');
                              AudioManager.instance.playSound(ESound.Capy, 0, 1, false);
                             AudioManager.instance.playSound(ESound.great, 2, 1, false);
                        });
                        this.rabbitAnim.play('Drink');
                         AudioManager.instance.playSound(ESound.thank, 0, 1, false);
                    }

                    if (this.Hand && this.Hand[4]) {
                        this.Hand[4].active = false;
                    }
                    if (this.Tap && this.Tap[4]) {
                        this.Tap[4].active = false;
                    }

                    this.activeCup.active = false;
                    if (this.cupColaRabbit) {
                        this.cupColaRabbit.active = true;
                        this.scheduleOnce(() => {
                            this.cupColaRabbit.active = false;
                        }, 2);
                    }
                    
                    this.activeCup = null;
                    this.canServeRabbit = false;
                }
                else if (hitNode.name.startsWith('CupCola')) {
                    if (this.activeCup || this.cupAtMachine) {
                        console.log('Đang trong quá trình pha chế, không thể lấy thêm ly mới.');
                        return; // Thoát ra, không làm gì cả
                    }
                    if (this.Hand.length > 1 && this.Tap.length > 1) {
                        if (this.Hand[0]) this.Hand[0].active = false;
                        if (this.Tap[0]) this.Tap[0].active = false;
                        if (this.Hand[1]) this.Hand[1].active = true;
                        if (this.Tap[1]) this.Tap[1].active = true;
                    }
                    if (!this.kitchenTool || !this.cupHolderNode) { return; }

                    const cupPrefab = this.kitchenTool.cupCafePrefab;
                    if (!cupPrefab) { return; }

                    const newCup = instantiate(cupPrefab);
                    this.node.scene.addChild(newCup);
                    newCup.setWorldPosition(this.kitchenTool.createdCupColas[0].getWorldPosition());

                    tween(newCup)
                        .to(0.5, { worldPosition: this.cupHolderNode.getWorldPosition() }, { easing: 'cubicOut' })
                        .call(() => {
                            newCup.setParent(this.cupHolderNode, true);
                            this.activeCup = newCup;
                        })
                        .start();
                }
                // LOGIC 2: Chạm vào MÁY COLA
                else if (hitNode.name.startsWith('Cola_Machine_Body')) {
                    if (this.activeCup) {
                        this.activeCup.setParent(this.node.scene, true);
                        const targetPosition = this.cokeTargetNode.getWorldPosition();

                        tween(this.activeCup)
                            .to(0.5, { worldPosition: targetPosition }, { easing: 'cubicOut' })
                            .call(() => {
                                this.cupAtMachine = this.activeCup;
                                this.activeCup = null;

                                if (this.Hand && this.Hand[1]) {
                                    this.Hand[1].active = false;
                                }
                                if (this.Tap && this.Tap[1]) {
                                    this.Tap[1].active = false;
                                }
                                if (this.Hand && this.Hand[2]) {
                                    this.Hand[2].active = true;
                                }
                                if (this.Tap && this.Tap[2]) {
                                    this.Tap[2].active = true;
                                }
                            })
                            .start();
                    }
                    // Tình huống B: Đổ đầy ly
                    else if (this.cupAtMachine && !this.isFilling && !this.isCupReadyToTake) {
                        if (!this.hasPouredAudioPlayed) {
                        AudioManager.instance.playSound(ESound.Pour, 0, 1, false);
                        this.hasPouredAudioPlayed = true; // Đánh dấu là đã phát
                    }
                        if (this.ButtonCfV1) {
                            this.ButtonCfV1.active = false;
                            this.scheduleOnce(() => {
                                if (this.ButtonCfV1) {
                                    this.ButtonCfV1.active = true;
                                }
                            }, 2);
                        }
                        
                        if (this.ButtonCfV2) {
                            this.ButtonCfV2.active = true;
                            this.scheduleOnce(() => {
                                if (this.ButtonCfV2) {
                                    this.ButtonCfV2.active = false;
                                }
                            }, 2);
                        }

                        if (this.Tap && this.Tap[2]) {
                            this.Tap[2].active = false;
                        }
                        if (this.Hand && this.Hand[2]) {
                            this.Hand[2].active = false;
                        }

                        this.scheduleOnce(() => {
                            if (this.Tap && this.Tap[3]) {
                                this.Tap[3].active = true;
                            }
                            if (this.Hand && this.Hand[3]) {
                                this.Hand[3].active = true;
                            }
                        }, 2);

                        this.isFilling = true;
                        this.scheduleOnce(() => {
                            const sphereNode = this.cupAtMachine.getChildByName('Sphere');
                            if (sphereNode) { sphereNode.active = true; }
                            this.isFilling = false;
                            this.isCupReadyToTake = true;
                            console.log('Đã đổ đầy cola! Bây giờ có thể lấy ly.');
                            if (this.colaMachineCollider) {
                                this.colaMachineCollider.enabled = false;
                                console.log('Cola Machine Collider ĐÃ TẮT.');
                            }
                        }, 1);
                    }
                }
                //LOGIC 3: Chạm vào CÁC ĐỐI TƯỢNG KHÁC
                else if (this.Touch.indexOf(hitNode) !== -1 || 
                         hitNode.name.startsWith('SaladBowl')|| 
                         hitNode.name.startsWith('PotatoChipsBox')||
                         hitNode.name.startsWith('chicken')||
                         hitNode.name.startsWith('lettuce')||
                         hitNode.name.startsWith('meat')||
                         hitNode.name.startsWith('steak')||
                         hitNode.name.startsWith('raw_potato')
                ) {
                    console.log(`Bạn đã chạm vào đối tượng: ${hitNode.name}!`);
                }
            }
        }
    }
}