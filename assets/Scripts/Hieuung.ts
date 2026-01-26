/* import { _decorator, Component, Node, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HieuungPhucTap')
export class HieuungPhucTap extends Component {
    @property({
        tooltip: 'Tỷ lệ nhỏ nhất mà nút sẽ co lại (trục đồng nhất)'
    })
    minScale: number = 0.95;

    @property({
        tooltip: 'Tỷ lệ lớn nhất mà nút sẽ phồng ra (trục đồng nhất)'
    })
    maxScale: number = 1.05;

    @property({
        tooltip: 'Tốc độ của hiệu ứng nhịp thở'
    })
    speed: number = 1.5;

    @property({
        tooltip: 'Cường độ hiệu ứng bóp méo (0 để tắt, giá trị cao hơn sẽ bóp méo nhiều hơn)'
    })
    squashStrength: number = 0.1;
    private _timer: number = 0;
    
    start() {
        this.node.setScale(this.minScale, this.minScale);
    }

    update(deltaTime: number) {
        this._timer += deltaTime * this.speed;
        const sinValue = Math.sin(this._timer);
        const range = this.maxScale - this.minScale;
        const uniformScale = this.minScale + (sinValue + 1) / 2 * range;
        const squashValue = sinValue * this.squashStrength; 
        const scaleX = uniformScale * (1 + squashValue);
        const scaleY = uniformScale * (1 - squashValue);

        this.node.setScale(scaleX, scaleY);
    }
} */