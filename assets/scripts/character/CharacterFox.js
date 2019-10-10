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
export default class CharacterFox extends cc.Component {

    @property(cc.Node)
    foxImageSprite = null ;

    @property(cc.SpriteFrame)
    biteFoxSpriteFrame = null ;

    @property(cc.SpriteFrame)
    coughFoxSpriteFrame = null ;

    @property(dragonBones.ArmatureDisplay)
    foxArmatureDisplay = null ;

    @property(cc.AudioClip)
    foxWinAudio = null ;

    @property(cc.AudioClip)
    foxCoughAudio = null ;

    setGuideAction() {
        this.foxImageSprite.stopAllActions() ;

        this.foxArmatureDisplay.node.active = false ;
        this.foxImageSprite.active = true ;
        this.foxImageSprite.getComponent(cc.Sprite).spriteFrame = this.biteFoxSpriteFrame ;//切换贴图

        this.foxImageSprite.rotation = 0;

        let rotateLeft = cc.rotateBy(0.2, -10) ;
        let rotateRight = cc.rotateBy(0.4, 20) ;
        let rotateMid = cc.rotateBy(0.2, -10) ;
        let seq = cc.sequence(rotateLeft, rotateRight, rotateMid) ;
        let repeat = cc.repeatForever(seq) ;
        
        this.foxImageSprite.runAction(repeat) ;
    }

    changeToCough() {
        this.foxImageSprite.stopAllActions() ;

        this.foxArmatureDisplay.node.active = false ;
        this.foxImageSprite.active = true ;
        this.foxImageSprite.getComponent(cc.Sprite).spriteFrame = this.coughFoxSpriteFrame ;//切换贴图

        this.foxImageSprite.rotation = 0;
        
        GameAudioEngine.playEffect(this.foxCoughAudio) ;

        let scale_1 = cc.scaleTo(0.1, 0.9, 0.9) ;
        let scale_2 = cc.scaleTo(0.1, 1.0, 1.0) ;
        let delay = cc.delayTime(1.0) ;

        let seq = cc.sequence(scale_1, scale_2, scale_1, scale_2, delay) ;
        let repeat = cc.repeatForever(seq) ;
        this.foxImageSprite.runAction(repeat) ;

    }

    changeToWinArmature() {
        this.foxImageSprite.active = false ;
        this.foxArmatureDisplay.node.active = true ;

        this.foxArmatureDisplay.armatureName = 'fox win' ;
        this.foxArmatureDisplay.playAnimation('win', 0) ;
    }

    sayGreat() {
        GameAudioEngine.playEffect(this.foxWinAudio) ;
    }
}