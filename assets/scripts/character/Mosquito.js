import Tools from "../common/Tools";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// cc.Class({
//     extends: cc.Component,

//     properties: {
//         // foo: {
//         //     // ATTRIBUTES:
//         //     default: null,        // The default value will be used only when the component attaching
//         //                           // to a node for the first time
//         //     type: cc.SpriteFrame, // optional, default is typeof default
//         //     serializable: true,   // optional, default is true
//         // },
//         // bar: {
//         //     get () {
//         //         return this._bar;
//         //     },
//         //     set (value) {
//         //         this._bar = value;
//         //     }
//         // },
//     },

//     // LIFE-CYCLE CALLBACKS:

//     // onLoad () {},

//     start () {

//     },

//     // update (dt) {},
// });

const {ccclass, property} = cc._decorator ;

@ccclass
export default class Mosquito extends cc.Component {

    @property(cc.Sprite)
    mosquitoImageSprite = null ;

    @property(cc.SpriteFrame)
    mosquitoAlive = null ;

    @property(cc.SpriteFrame)
    mosquitoDie = null ;

    @property(cc.AnimationClip)
    mosquitoAnim = null ;

    onLoad() {
        this.mosquitoAnim.speed = Tools.getRandomFloat(0.5, 1) ;
        let animName = this.mosquitoAnim.name ;
        let animTime = this.mosquitoAnim.duration ;
        let animStartTime = Tools.getRandomFloat(0, animTime) ;
        let anim = this.mosquitoImageSprite.getComponent(cc.Animation) ;
        anim.play(animName, animStartTime) ;
        console.log('name : ' + animName + '| time : ' + animStartTime + '| duration :' + animTime + '| speed : ' + this.mosquitoAnim.speed) ;
    }

    stopFly() {
        if(this.mosquitoImageSprite.node.getScaleX() <= 0) {
            this.mosquitoImageSprite.node.setScaleX(-1.0);
        }else {
            this.mosquitoImageSprite.node.setScaleX(1.0);
        }
        let anim = this.mosquitoImageSprite.getComponent(cc.Animation) ;
        anim.stop() ;
    }

    update(dt) {
        //console.log('scale : ' + this.mosquitoImageSprite.node.getScaleX()  + '|' + this.mosquitoImageSprite.node.getScaleY() ) ;
    }

    die() {
        console.log('mosquito die') ;
        //this.mosquitoImageSprite.node.setPosition(0, 0) ;
        this.mosquitoImageSprite.spriteFrame = this.mosquitoDie ;
    }

    getMosquitoPosition() {
        return  this.node.convertToWorldSpaceAR(this.mosquitoImageSprite.node.getPosition()) ;
    }
    
}