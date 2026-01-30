import { _decorator, CCString, Component, Enum, Prefab, SpriteFrame } from "cc";
import { OrderName, OrderType } from "../../Core/Enum";

const {ccclass, property} = _decorator

@ccclass('DisplayData')
export class DisplayData{
    @property({type: Enum(OrderName)})
    orderName: OrderName;

    @property(Prefab)
    prefab: Prefab[] = [];
}