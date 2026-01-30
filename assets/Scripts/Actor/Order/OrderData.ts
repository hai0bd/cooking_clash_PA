import { _decorator, CCString, Component, Enum, SpriteFrame } from "cc";
import { OrderName, OrderType } from "../../Core/Enum";

const {ccclass, property} = _decorator

@ccclass('OrderData')
export class OrderData{
    @property({type: Enum(OrderName)})
    orderName: OrderName;

    @property(SpriteFrame)
    spriteFr: SpriteFrame | null = null;
}