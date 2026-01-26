import { _decorator, CCString, Component, Enum, SpriteFrame } from "cc";
import { OrderType } from "../../Core/Enum";

const {ccclass, property} = _decorator

@ccclass('OrderData')
export class OrderData{
    @property({type: Enum(OrderType)})
    orderName: OrderType;

    @property(SpriteFrame)
    spriteFr: SpriteFrame | null = null;
}