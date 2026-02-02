import { _decorator, SpriteFrame } from 'cc';
import { OrderCategory, OrderName, OrderType } from '../../Core/Enum';

export class OrderService {
    getRandomOrder(): Order {
        const name = this.getRandomName();
        // const name = OrderName.SANDWICH;
        const category = this.getCategory(name);
        const text = this.getRandomLine(name);

        return { category, name: name, text };
    }

    getCategory(orderName: OrderName) : OrderCategory{
        if(orderName == OrderName.COFFEE) return OrderCategory.DRINK;
        else if(orderName == OrderName.BOMB) return OrderCategory.THROW
        return OrderCategory.EAT;
    }

    getRandomName(): OrderName {
        const RandomStates = [OrderName.COFFEE, OrderName.BEEFSTEAK, OrderName.SALAD, OrderName.SANDWICH, OrderName.CHICKEN];
        return RandomStates[Math.floor(Math.random() * RandomStates.length)];
    }

    getRandomLine(name: OrderName): string {
        const lines = OrderLines[name];
        return lines[Math.floor(Math.random() * lines.length)];
    }
}

export interface Order {
    category: OrderCategory;
    name: OrderName;
    text: string;
}

export const OrderLines: Record<OrderName, string[]> = {
    [OrderName.COFFEE]: ["Coffee", "Water"],
    [OrderName.BEEFSTEAK]: ["Beef", "Salt", "Pepper"],
    [OrderName.SALAD]: ["Lettuce", "Tomato", "Cucumber"],
    [OrderName.SANDWICH]: ["Bread", "Ham", "Cheese"],
    [OrderName.CHICKEN]: ["Chicken"],
    [OrderName.BOMB]: ["Boom!", "Explosion!"]
};