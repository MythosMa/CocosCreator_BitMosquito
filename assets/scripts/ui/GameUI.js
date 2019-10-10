import PlayerController from "../common/PlayerController";
import GameAudioEngine from "../common/GameAudioEngine";

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
export default class GameUI extends cc.Component {

    @property(cc.Sprite)
    coinSprite = null ;

    @property(cc.Label)
    coinText = null ;


    @property(cc.AudioClip)
    addCoinAudio = null ;

    onLoad() {
        this._showCoin = PlayerController._playerCoin ;
    }

    refreshShowCoin() {
        this._showCoin = PlayerController._playerCoin ;
        this.refreshShowCoinUI() ;
    }

    refreshShowCoinUI() {
        this.coinText.string = '' + this._showCoin ;
    }

    addCoinAnim() {
        let addCoin = PlayerController._playerCoin - this._showCoin ;
        for(let i = 0 ; i < addCoin ; i++) {

            //动态创建sprite
            let node = new cc.Node('Sprite') ;
            let coinSpriteTemp = node.addComponent(cc.Sprite) ;
            coinSpriteTemp.spriteFrame = this.coinSprite.spriteFrame ;

            coinSpriteTemp.node.setPosition(0 - i * 50, 0) ;
            this.node.addChild(node, addCoin - i) ;

            let delay = cc.delayTime(0.2 * (i + 1)) ;
            let moveTo = cc.moveTo(0.5, this.coinSprite.node.getPosition()) ;
            let callback = cc.callFunc(()=>{
                GameAudioEngine.playEffect(this.addCoinAudio) ;
               this._showCoin++ ;
               this.refreshShowCoinUI() ;
               node.removeFromParent(true) ; 
            }) ;

            let seq = cc.sequence(delay, moveTo, callback) ;
            coinSpriteTemp.node.runAction(seq) ;
        }
    }
}