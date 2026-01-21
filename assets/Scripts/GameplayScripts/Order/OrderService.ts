import { _decorator } from 'cc';
import { OrderType } from './OrderType';

export class OrderService {
    getRandomOrder(): Order {
        const type = this.getRandomType();
        const text = this.getRandomLine(type);

        return { type, text };
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
    type: OrderType;
    text: string;
}

export const OrderLines: Record<OrderType, string[]> = {
    [OrderType.COFFEE]: ["Coffee", "Water"],
    [OrderType.BEEFSTEAK]: ["Beef", "Salt", "Pepper"],
    [OrderType.SALAD]: ["Lettuce", "Tomato", "Cucumber"],
    [OrderType.SANDWICH]: ["Bread", "Ham", "Cheese"],
    [OrderType.BOMB]: ["Boom!", "Explosion!"]
};