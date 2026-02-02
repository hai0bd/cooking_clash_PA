import { _decorator, CCString, Component, Enum, Prefab, SpriteFrame } from "cc";
import { OrderName, OrderType } from "../../Core/Enum";
import { PopupOrder } from "../../UIScripts/PopupOrder";

const {ccclass, property} = _decorator

@ccclass('RecipeData')
export class RecipeData{
    @property({type: Enum(OrderType)})
    type: OrderType;

    @property(SpriteFrame)
    typeSprite: SpriteFrame | null = null;
}