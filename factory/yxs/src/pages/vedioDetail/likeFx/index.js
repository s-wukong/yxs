import Taro, { Component } from '@tarojs/taro'
import { View, Canvas } from '@tarojs/components'
import './index.scss'
import LOVED from './assets/loved.png'



export default class LikeFX extends Component {
  static defaultProps = {
    count: 0
  }

  // state = {
  //   queue: {},
  //   timer: 0,
  //   ctx: null
  // }
  constructor(){
    this.queue = {};
    this.timer = 0;
    this.ctx = null;
  }

  componentWillReceiveProps(nextProps){
    if (nextProps.count - this.props.count > 0) {
      this.likeClick();
    }
  }

  componentDidMount(){
    this.ctx = Taro.createCanvasContext("bubble", this);
  }

  componentWillUnmount(){
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  likeClick() {
    let { queue } = this;
    const image = LOVED;
    const anmationData = {
      id: new Date().getTime(),
      timer: 0,
      opacity: 0,
      pathData: this.generatePathData(),
      image: image,
      factor: {
        speed: 0.01, // 运动速度，值越小越慢
        t: 0 //  贝塞尔函数系数
      }
    };
    if (Object.keys(queue).length > 0) {
      queue[anmationData.id] = anmationData;
    } else {
      queue[anmationData.id] = anmationData;
      this.bubbleAnimate();
    }
  };

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  };

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  generatePathData() {
    const p0 = { x: 40, y: 400 };
    const p1 = {
      x: this.getRandom(20, 30),
      y: this.getRandom(200, 300)
    };
    const p2 = {
      x: this.getRandom(0, 80),
      y: this.getRandom(100, 200)
    };
    const p3 = {
      x: this.getRandom(0, 80),
      y: this.getRandom(0, 50)
    };
    return [p0, p1, p2, p3];
  };

  updatePath = (data, factor) => {
    const p0 = data[0];
    const p1 = data[1];
    const p2 = data[2];
    const p3 = data[3];

    const t = factor.t;

    /*计算多项式系数 （下同）*/
    const cx1 = 3 * (p1.x - p0.x);
    const bx1 = 3 * (p2.x - p1.x) - cx1;
    const ax1 = p3.x - p0.x - cx1 - bx1;

    const cy1 = 3 * (p1.y - p0.y);
    const by1 = 3 * (p2.y - p1.y) - cy1;
    const ay1 = p3.y - p0.y - cy1 - by1;

    const x = ax1 * (t * t * t) + bx1 * (t * t) + cx1 * t + p0.x;
    const y = ay1 * (t * t * t) + by1 * (t * t) + cy1 * t + p0.y;
    return {
      x,
      y
    };
  };

  bubbleAnimate = () => {
    let { queue, timer, ctx } = this;
    Object.keys(queue).forEach(key => {
      const anmationData = queue[+key];
      const { x, y } = this.updatePath(
        anmationData.pathData,
        anmationData.factor
      );
      const speed = anmationData.factor.speed;
      anmationData.factor.t += speed;
      ctx.drawImage(anmationData.image, x, y, 30, 30);
      if (anmationData.factor.t > 1) {
        delete queue[anmationData.id];
      }
    });
    ctx.draw();
    if (Object.keys(queue).length > 0) {
      timer = setTimeout(() => {
        this.bubbleAnimate();
      }, 20);
    } else {
      clearTimeout(timer);
      ctx.draw(); // 清空画面
    }
  }

  render () {

    return (
      <View className="like-fx">
          <Canvas canvasId="bubble" style="width:90px;height:400px"></Canvas>
      </View>
    )
  }
}

