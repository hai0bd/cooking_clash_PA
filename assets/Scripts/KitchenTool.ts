import { _decorator, Component, Node, Prefab, instantiate, Vec3 } from 'cc';
const { ccclass, property } = _decorator;
interface SpawnData {
    pos: Vec3;
    scale?: number;    
    rotation?: Vec3;  
}

@ccclass('KitchenTool')
export class KitchenTool extends Component {

    @property(Prefab) public trayPrefab: Prefab = null;
    @property(Prefab) public cupCafePrefab: Prefab = null;
    @property(Prefab) public chickenPrefab: Prefab = null;
    @property(Prefab) public meatPrefab: Prefab = null;
    @property(Prefab) public steakPrefab: Prefab = null;
     @property(Prefab) public lettucePrefab: Prefab = null;

     public createdCupColas: Node[] = [];

    start() {
        const spawnConfigs = [
              { name: "Tray", prefab: this.trayPrefab, data: [
                { pos: new Vec3(-0.17, 1.05, 2.5) }, { pos: new Vec3(-0.17, 1.05, 2.217) },
                { pos: new Vec3(0.13, 1.05, 2.5) }, { pos: new Vec3(0.13, 1.05, 2.217) }
            ]},
            { name: "CupCola", prefab: this.cupCafePrefab, data: [
                { pos: new Vec3(-0.46, 1.069, 2.53) }, { pos: new Vec3(-0.46, 1.069, 2.53) }
            ]},
            { name: "Chicken", prefab: this.chickenPrefab, data: [
                { pos: new Vec3(-0.2, 1.11, 2.55) }, { pos: new Vec3(-0.15, 1.1, 2.5) },
                { pos: new Vec3(-0.17, 1.09, 2.53) }
            ]},
            { name: "Meat", prefab: this.meatPrefab, data: [
                { pos: new Vec3(-0.15, 1.065, 2.221) }, { pos: new Vec3(-0.15, 1.085, 2.211) },
                { pos: new Vec3(-0.15, 1.095, 2.218) }
            ]},
            { name: "Steak", prefab: this.steakPrefab, data: [
                { pos: new Vec3(0.136, 1.065, 2.2), scale: 1, rotation: new Vec3(0, 0, 0) },
                { pos: new Vec3(0.136, 1.07, 2.2), scale: 0.9, rotation: new Vec3(0, 30, 0) },
                { pos: new Vec3(0.136, 1.06, 2.2), scale: 0.8, rotation: new Vec3(0, -10, 0) }
            ]},
              { name: "Lettuce", prefab: this.lettucePrefab, data: [
                { pos: new Vec3(0.15, 1.05, 2.5), scale: 1, rotation: new Vec3(-90, 0, 0) },
                { pos: new Vec3(0.12, 1.08, 2.5), scale: 0.9, rotation: new Vec3(-90, -10, 0) },
                { pos: new Vec3(0.105, 1.1, 2.5), scale: 0.7, rotation: new Vec3(-90, 30, 0) }
            ]},
        ];
        for (const config of spawnConfigs) {
            this.spawnItems(config.name, config.prefab, config.data);
        }
    }
    private spawnItems(name: string, prefab: Prefab, data: SpawnData[]): void {
        if (!prefab) {
            console.warn(`Chưa gán Prefab cho '${name}' vào component KitchenTool!`);
            return;
        }

        for (const itemData of data) {
            const newNode = instantiate(prefab);
            this.node.parent.addChild(newNode);
            newNode.setPosition(itemData.pos);
            if (itemData.scale !== undefined) {
                newNode.setScale(itemData.scale, itemData.scale, itemData.scale);
            }
            if (itemData.rotation) {
                newNode.setRotationFromEuler(itemData.rotation.x, itemData.rotation.y, itemData.rotation.z);
            }
             if (name === "CupCola") {
                this.createdCupColas.push(newNode);
            }
        }
    }
    update(deltaTime: number) {}
}