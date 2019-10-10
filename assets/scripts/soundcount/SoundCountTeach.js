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
export default class SoundCountTeach extends cc.Component {

    @property(cc.Node) 
    lockBox = null ;

    @property(cc.Label)
    tipText = null ;

    @property(dragonBones.ArmatureDisplay)
    foxAnim = null ;

    @property
    questionCount = 0 ;

    @property
    minNumber = 0 ;

    onLoad() {
        this._startStep = 0 ;
        this.makeQuestion() ;
    }

    start() {
        let moveAction = cc.moveTo(2.0, cc.p(224, -214)) ;
        let callbackAction = cc.callFunc(this.playStory.bind(this)) ;
        let action = cc.sequence(moveAction, callbackAction) ;
        this.foxAnim.node.runAction(action) ;
    }

    playStory(delta) {
        if(this._startStep === 0) {
            this.tipText.node.active = true ;
            this.tipText.string = '奇怪，这里怎么会有会动的个箱子？' ;
            this.scheduleOnce(this.storyUpdate, 2.0) ;
            return ;
        }
        if(this._startStep === 1) {
            this.tipText.string = '箱子上有密码锁诶！' ;
            this.scheduleOnce(this.storyUpdate, 2.0) ;
            return ;
        }
        if(this._startStep === 2) {
            this.tipText.string = '想办法打开看看吧！！' ;
            this.scheduleOnce(this.storyUpdate, 2.0) ;
            return ;
        }
    }

    storyUpdate(delta) {
        this._startStep++ ;
        this.scheduleOnce(this.playStory, 0.1) ;
    }


    makeQuestion() {
        this._questions = new Array() ;
        for(let i = 0 ; i < this.questionCount ; i++)  {
            this._questions[i] = this.minNumber + i ;
        }

        let len = this._questions.length ;
        for(let i = 0 ; i < len - 1 ; i++) {
            let index = Tools.getRandomInt(0, len - i - 1) ;
            let temp = this._questions[ index ] ;
            this._questions[ index ] = this._questions[ len - i - 1 ] ;
            this._questions[ len - i - 1 ] = temp ;
        }
    }

}

