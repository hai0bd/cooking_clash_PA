import { _decorator, SpriteFrame } from 'cc';
import { OrderCategory, OrderType } from '../../Core/Enum';

export class OrderService {
    getRandomOrder(): Order {
        const type = this.getRandomType();
        const category = this.getCategory(type);
        const text = this.getRandomLine(type);

        return { category, type, text };
    }

    getCategory(orderType: OrderType) : OrderCategory{
        if(orderType == OrderType.COFFEE) return OrderCategory.DRINK;
        else if(orderType == OrderType.BOMB) return OrderCategory.THROW
        return OrderCategory.EAT;
    }

    getRandomType(): OrderType {
        const RandomStates = [OrderType.COFFEE, OrderType.BEEFSTEAK, OrderType.SALAD, OrderType.SANDWICH];
        return RandomStates[Math.floor(Math.random() * RandomStates.length)];
    }

    getRandomLine(type: OrderType): string {
        const lines = OrderLines[type];
        return lines[Math.floor(Math.random() * lines.length)];
    }
}

export interface Order {
    category: OrderCategory;
    type: OrderType;
    text: string;
}

export const OrderLines: Record<OrderType, string[]> = {
    [OrderType.COFFEE]: ["Coffee", "Water"],
    [OrderType.BEEFSTEAK]: ["Beef", "Salt", "Pepper"],
    [OrderType.SALAD]: ["Lettuce", "Tomato", "Cucumber"],
    [OrderType.SANDWICH]: ["Bread", "Ham", "Cheese"],
    [OrderType.CHICKEN]: ["Chicken"],
    [OrderType.CHIPS]: ["Chip"],
    [OrderType.BOMB]: ["Boom!", "Explosion!"]
};