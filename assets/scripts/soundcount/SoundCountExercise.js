import Tools from "../common/Tools";
import GameAudioEngine from "../common/GameAudioEngine";
import Mosquito from "../character/Mosquito";
import CharacterFox from "../character/CharacterFox";
import PlayerController from "../common/PlayerController";
import GameUI from "../ui/GameUI";

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
export default class SoundCountExercise extends cc.Component {
    @property(cc.AudioClip)
    guideAudio = null ;

    @property(cc.AudioClip)
    mosquitoSound = null ;

    @property(cc.AudioClip)
    correctNumberAudio = [10];

    @property(cc.AudioClip)
    numberTipAudio = [10] ;

    @property(cc.AudioClip)
    sprayUseAudio = null ;

    @property(cc.AudioClip)
    mosquitoDropAudio = null ;

    @property(cc.AudioClip)
    thinkAgainAudio = null ;

    @property(cc.AudioClip)
    choosLargerAudio = null ;

    @property(cc.AudioClip)
    choosSmallerAudio = null ;

    @property(cc.AudioClip)
    coughAudio = null ;

    @property(cc.SpriteFrame)
    correctAnswerButtonTexture = [10] ;

    @property(cc.Prefab)
    mosquitoPrefab = null ;

    @property(dragonBones.ArmatureDisplay)
    spray = null ;

    @property(cc.Node)
    gameUI = null ;

    @property(cc.Node)
    characterLayer = null ;

    @property(cc.Node)
    guideLayer = null ;

    @property(cc.Node)
    makeQuestionLayer = null ;

    @property(cc.Node)
    answerLayer = null ;

    @property(cc.Node)
    winLayer = null ;

    @property(cc.Node)
    fox = null ;

    @property(cc.Node)
    tipHand = null ;

    @property(cc.Node)
    ear = null ;

    @property(cc.Button)
    startButton = null ;

    @property(cc.Button)
    answerButton1 = null ;

    @property(cc.Button)
    answerButton2 = null ;

    @property(cc.Button)
    answerButton3 = null ;

    @property
    guideMosquitoCount = 0 ;

    @property
    guideMosquitoMinX = 0 ;

    @property
    guideMosquitoMaxX = 0 ;

    @property
    guideMosquitoMinY = 0 ;

    @property
    guideMosquitoMaxY = 0 ;

    @property
    questionCount = 0 ;

    @property
    questionMinNumber = 0 ;
    

    onLoad() {
        this._sprayStartPosition = this.spray.node.getPosition() ;
        this._tipHandStartPosition = this.tipHand.getPosition() ;

        this.makeQuestion() ;
        this._currentGameState = 0 ;
        this._gameState = cc.Enum({
            STATE_GUIDE : 1,
            STATE_TEACH : -1,
            STATE_PLAY : -1,
            STATE_END : -1,
        });

        this.changeGameState(this._gameState.STATE_GUIDE) ;

        console.log('spray name :' + this.spray.animationName) ;
    }

    makeQuestion() {
        this._answerTime  = 0 ;

        this._questions = new Array() ;
        this._questions[0] = 2 ;

        for(let i = 1 ; i < this.questionCount ; i++) {
            this._questions[i] = this.questionMinNumber + i ; 
        }

        let len = this._questions.length ;
        for(let i = 0 ; i < len - 1 ; i++) {
            let index = Tools.getRandomInt(1, len - i - 1) ;
            let temp = this._questions[ index ] ;
            this._questions[ index ] = this._questions[ len - i - 1 ] ;
            this._questions[ len - i - 1 ] = temp ;
        }
    }

    changeGameState(gameState) {
        if(gameState === this._currentGameState) {
            return ;
        }

        this._currentGameState = gameState ;
        switch(gameState) {
            case this._gameState.STATE_GUIDE:
            this.startGuideIntro() ;
            break;
            case this._gameState.STATE_TEACH:
            this.questionIndex = 0 ;
            this.startTeach() ;
            break;
            case this._gameState.STATE_PLAY:
            this.startTeach() ;
            break;
            case this._gameState.STATE_END:
            this.showWinUILayer() ;
            break;
        }
    }

    startGuideIntro() {
        this._currentGameState = this._gameState.STATE_GUIDE ;
        for(let i = 0 ; i < this.guideMosquitoCount ; i++) {
            let mosquito = cc.instantiate(this.mosquitoPrefab) ;
            let x = Tools.getRandomFloat(this.guideMosquitoMixX, this.guideMosquitoMaxX) ;
            let y = Tools.getRandomFloat(this.guideMosquitoMinY, this.guideMosquitoMaxY) ;
            mosquito.setPosition(cc.p(x, y)) ;
            this.guideLayer.addChild(mosquito) ;

            this.fox.getComponent('CharacterFox').setGuideAction() ;
        }
        
        GameAudioEngine.playMusic(this.guideAudio, false, this.guideIntroCallback.bind(this)) ;
    }

    guideIntroCallback() {
        this.guideLayer.removeAllChildren(true) ;
        this.guideLayer.active = false ;
        this.changeGameState(this._gameState.STATE_TEACH) ;
    }

    startTeach() {
        this._questionNumber = 0 ;
        this._soundPlayTimes = 0 ;
        this._chooseNumber = 0 ;

        this.spray.node.setPosition(this._sprayStartPosition) ;

        this.fox.getComponent('CharacterFox').setGuideAction() ;

        if(this._currentGameState === this._gameState.STATE_TEACH) {
            this.tipHand.active = true ;

            this.tipHand.setPosition(this._tipHandStartPosition) ;

            let moveBy_1 = cc.moveBy(0.5, cc.p(0, 25)) ;
            let moveBy_2 = cc.moveBy(0.5, cc.p(0, -25)) ;
            let seq = cc.sequence(moveBy_1, moveBy_2) ;
            let repeat = cc.repeatForever(seq) ;
            this.tipHand.runAction(repeat) ;
        }

        let scaleTo_1 = cc.scaleTo(0.5, 1.2, 1.2) ;
        let scaleTo_2 = cc.scaleTo(0.5, 1.0, 1.0) ;
        let scaleSeq = cc.sequence(scaleTo_1, scaleTo_2) ;
        let scaleRepeat = cc.repeatForever(scaleSeq) ;
        this.ear.runAction(scaleRepeat) ;

        this.makeQuestionLayer.active = true ; 
        this.startButton.node.active = true ;
        this.ear.active = false ;
    }

    startButtonCallback(event) {

        let button = event.currentTarget ;
        button.stopAllActions() ;
        button.setScale(1.0, 1.0) ;

        this.startButton.node.active = false ;
        this.tipHand.active = false ;
        this.ear.active = true ;

        this._questionNumber = this._questions[this.questionIndex] ;
        
        console.log('question : ' + this._questions) ;

        this.currentQuestion = new Array() ;

        let correctNumberIndex = Tools.getRandomInt(0, 2) ;
        if(this._questionNumber === this.questionMinNumber) {
            correctNumberIndex = Tools.getRandomInt(0, 1) ;
        }else if(this._questionNumber === (this.questionMinNumber + this.questionCount - 2)) {
            correctNumberIndex = Tools.getRandomInt(1, 2) ;
        }else if(this._questionNumber === (this.questionMinNumber + this.questionCount - 1)) {
            correctNumberIndex = 2 ;
        }

        console.log('correctNumberIndex : ' + correctNumberIndex) ;

        if(correctNumberIndex === 0) {
            this.currentQuestion[0] = this._questionNumber ;
            this.currentQuestion[1] = this._questionNumber + 1 ;
            this.currentQuestion[2] = this._questionNumber + 2 ;
        }else if(correctNumberIndex === 1) {
            this.currentQuestion[0] = this._questionNumber - 1 ;
            this.currentQuestion[1] = this._questionNumber ;
            this.currentQuestion[2] = this._questionNumber + 1 ;
        }else  if(correctNumberIndex === 2) {
            this.currentQuestion[0] = this._questionNumber - 2 ;
            this.currentQuestion[1] = this._questionNumber - 1 ;
            this.currentQuestion[2] = this._questionNumber ;
        }


        //this.currentQuestion[0] = this._questionNumber ;

        // while(this.currentQuestion.length < 3) {
        //     let indexTemp = Tools.getRandomInt(0, this._questions.length - 1) ;
        //     let temp = this._questions[indexTemp] ;
        //     let isSame = false ;
        //     for(let index in this.currentQuestion) {
        //         if(temp === this.currentQuestion[index]) {
        //             isSame = true ;
        //             break ;
        //         }
        //     }
        //     if(!isSame) {
        //         this.currentQuestion[this.currentQuestion.length] = temp ;
        //     }
        // }

        // let len = this.currentQuestion.length ;
        // for(let i = 0 ; i < len - 1 ; i++) {
        //     let index = Tools.getRandomInt(0, len - i - 1) ;
        //     let temp = this.currentQuestion[ index ] ;
        //     this.currentQuestion[ index ] = this.currentQuestion[ len - i - 1 ] ;
        //     this.currentQuestion[ len - i - 1 ] = temp ;
        // }

        console.log(this.currentQuestion) ;

        this.soundPlayCallback() ;
    }

    soundPlayCallback() {
        console.log('sound play times : ' + this._soundPlayTimes) ;
        if(this._soundPlayTimes === this._questionNumber) {
            this.ear.active = false ;
            this.makeAnswerLayer() ;
        }else {
            if(this._answerTime  === 2) {
                this.scheduleOnce(() => {
                    this._soundPlayTimes++ ;
                    GameAudioEngine.playMusic(this.mosquitoSound, false, this.soundPlayNumberCallback.bind(this)) ;
                }, 0.5) ;
            }else {
                this.scheduleOnce(() => {
                    this._soundPlayTimes++ ;
                    GameAudioEngine.playMusic(this.mosquitoSound, false, this.soundPlayCallback.bind(this)) ;
                }, 1.0) ;
            }
        }
    }

    soundPlayNumberCallback() {
        GameAudioEngine.playMusic(this.numberTipAudio[this._soundPlayTimes], false, ()=>{
            this.scheduleOnce(() => {
                this.soundPlayCallback() ;
            }, 0.8);
        }) ;
    }

    makeAnswerLayer() {
        this.answerLayer.active = true ;
        this.spray.node.active = true ;

        this.answerButton1.interactable = true ;
        this.answerButton1.node.active = true ;
        this.answerButton2.interactable = true ;
        this.answerButton2.node.active = true ;
        this.answerButton3.interactable = true ;
        this.answerButton3.node.active = true ;
        
        this.answerButton1.getComponent(cc.Sprite).spriteFrame = this.correctAnswerButtonTexture[this.currentQuestion[0]] ;
        this.answerButton2.getComponent(cc.Sprite).spriteFrame = this.correctAnswerButtonTexture[this.currentQuestion[1]] ;
        this.answerButton3.getComponent(cc.Sprite).spriteFrame = this.correctAnswerButtonTexture[this.currentQuestion[2]] ;

        if(this._currentGameState === this._gameState.STATE_TEACH) {
            this.tipHand.active = true ;
            let position = null ;
            for(let index = 0 ; index < this.currentQuestion.length ; index++) {
                console.log('question : ' + this._questionNumber + '| current :' + this.currentQuestion[index] + '| index : ' + index) ;
                if(this._questionNumber === this.currentQuestion[index]) {
                    if(index === 0 ) {
                        position = this.answerButton1.node.getPosition() ;
                    }else if(index === 1) {
                        position = this.answerButton2.node.getPosition() ;
                    }else if(index === 2) {
                        position = this.answerButton3.node.getPosition() ;
                    }
                    break ;
                }
            }
            this.tipHand.setPosition(cc.p(position.x, position.y - 50)) ;
        }
        
    }

    //按钮的回调，第一个参数按钮事件，第二个参数是自定义传入事件
    answerButtonCallback(event, customEvent) {

        let button = event.currentTarget ;
        button.stopAllActions();
        button.setScale(1.0, 1.0) ;

        let correctButton = null ;

        if(customEvent === 'answer_1') {
            this._chooseNumber = this.currentQuestion[0] ;
        }else if(customEvent === 'answer_2') {
            this._chooseNumber = this.currentQuestion[1] ;
        }else if(customEvent === 'answer_3') {
            this._chooseNumber = this.currentQuestion[2] ;
        }

        for(let index = 0 ; index < this.currentQuestion.length ; index++) {
            if(this._questionNumber === this.currentQuestion[index]) {
                if(index === 0 ) {
                    correctButton = this.answerButton1 ;
                }else if(index === 1) {
                    correctButton = this.answerButton2 ;
                }else if(index === 2) {
                    correctButton = this.answerButton3 ;
                }
                break ;
            }
        }

        if(this._currentGameState === this._gameState.STATE_TEACH) {
            this.tipHand.active = false ;
        }

        this._answerTime ++ ;
        // if(this._chooseNumber === this._questionNumber) {
        //     this.answerCorrect() ;
        // }else {
        //     this.answerWrong() ;
        // }

        this.guideLayer.removeAllChildren(true) ;
        for(let i = 0 ; i < this._questionNumber ; i++) {
            let mosquito = cc.instantiate(this.mosquitoPrefab) ;
            let x = Tools.getRandomFloat(this.guideMosquitoMinX, this.guideMosquitoMaxX) ;
            let y = Tools.getRandomFloat(this.guideMosquitoMinY, this.guideMosquitoMaxY) ;
            mosquito.setPosition(cc.p(x, y)) ;
            this.guideLayer.addChild(mosquito, 0, i) ;
        }

        if(this._chooseNumber === this._questionNumber || this._answerTime  !== 3) {
            this.makeQuestionLayer.active = false ;
            this.answerLayer.active = false ;
            this.characterLayer.active = true ;

            this.guideLayer.active = true ;
            this.killedCount = 0 ;
            this.scheduleOnce(this.killMosquito.bind(this), 1.0) ;
            //this.killMosquito() ;
        }else {
            this.spray.node.active = false ;
            this.answerButton1.interactable = false ;
            this.answerButton2.interactable = false ;
            this.answerButton3.interactable = false ;

            if(this.answerButton1 !== correctButton) {
                this.answerButton1.node.active = false ;
            }
            if(this.answerButton2 !== correctButton) {
                this.answerButton2.node.active = false ;
            }
            if(this.answerButton3 !== correctButton) {
                this.answerButton3.node.active = false ;
            }

            let scaleTo_1 = cc.scaleTo(0.5, 1.2, 1.2) ;
            let scaleTo_2 = cc.scaleTo(0.5, 1.0, 1.0) ;
            let callback = cc.callFunc(()=>{
                this.answerWrongTime_3() ;
            });
            let seq = cc.sequence(scaleTo_1, scaleTo_2, scaleTo_1, scaleTo_2, scaleTo_1, scaleTo_2, callback) ;
            correctButton.node.runAction(seq);
        }

    }

    killMosquito() {
        console.log('kill count : ' + this.killedCount + '| question : ' + this._questionNumber) ;
        //根据蚊子数量，挨个喷杀
        if(this.killedCount === this._chooseNumber) {
            this.spray.node.active = false ;

            if(this._chooseNumber === this._questionNumber) {
                this.scheduleOnce(this.answerCorrect, 0.0) ;
            }else {
                this.scheduleOnce(this.answerWrong, 0.0) ;
            }
        }else {
            if(this.killedCount < this._questionNumber) {
                let mosquito = this.guideLayer.getChildByTag(this.killedCount) ;
                mosquito.getComponent(Mosquito).stopFly() ;
                let moveTo = cc.moveTo(0.0, this.node.convertToNodeSpaceAR(mosquito.getComponent(Mosquito).getMosquitoPosition())) ;
                let callback = cc.callFunc(() =>{
                    this.spray.armatureName = 'SprayUse' ;
                    this.spray.playAnimation('SprayUse', 1) ;
                    GameAudioEngine.playEffect(this.sprayUseAudio) ;

                    mosquito.getComponent(Mosquito).die() ;
    
                    let delay = cc.delayTime(0.3) ;
                    let callback_1 = cc.callFunc(() => {
                        this.spray.armatureName = 'SprayStop' ;
                        this.spray.playAnimation('SprayStop', 1) ;

                        GameAudioEngine.playEffect(this.mosquitoDropAudio) ;
                    });
                    let moveBy = cc.moveBy(1.0, cc.p(0, -600)) ;
                    let callback_2 = cc.callFunc(() =>{
                        mosquito.removeFromParent(true) ;
                        this.killedCount++ ;
                        this.killMosquito() ;
                    }) ;
                    let seq = cc.sequence(delay, callback_1, moveBy, callback_2) ;
                    mosquito.runAction(seq) ;
                }) ;
                let seq = cc.sequence(moveTo, callback) ;
        
                this.spray.node.runAction(seq) ;
            }else {
                let distance = 0 ;
                let x = 0;
                let y = 0 ;
                while(distance <= 250) {
                    x = Tools.getRandomFloat(this.guideMosquitoMinX, this.guideMosquitoMaxX) ;
                    y = Tools.getRandomFloat(this.guideMosquitoMinY + 100, this.guideMosquitoMaxY) ;
                    distance = Tools.getDistance(this.spray.node.getPosition(), cc.p(x, y)) ;
                }

                let moveTo = cc.moveTo(0.5, cc.p(x, y)) ;
                let callback_1 = cc.callFunc(() =>{
                    this.spray.armatureName = 'SprayUse' ;
                    this.spray.playAnimation('SprayUse', 1) ;
                    GameAudioEngine.playEffect(this.sprayUseAudio) ;
                });
                let delay = cc.delayTime(0.5) ;
                let callback_2 = cc.callFunc(() => {
                    this.spray.armatureName = 'SprayStop' ;
                    this.spray.playAnimation('SprayStop', 1) ;
                    this.killedCount++ ;
                    this.killMosquito();
                });
                let seq = cc.sequence(moveTo, callback_1, delay, callback_2) ;
                this.spray.node.runAction(seq) ;
            }
        }

        //随机几个地方喷几下然后全部蚊子死亡
        // if(this.killedCount === this._chooseNumber) {
        //     this.spray.node.active = false ;

        //     for(let i = 0 ; i < (this._questionNumber > this._chooseNumber ? this._chooseNumber : this._questionNumber) ; i++) {
        //         let mosquito = this.guideLayer.getChildByTag(i) ;

        //         mosquito.getComponent(Mosquito).stopFly() ;
        //         mosquito.getComponent(Mosquito).die() ;

        //         let moveBy = cc.moveBy(1.0, cc.p(0, -600)) ;
        //         let callback = cc.callFunc(() =>{
        //             mosquito.removeFromParent(true) ;
        //         });
        //         let seq = cc.sequence(moveBy, callback) ;
        //         mosquito.runAction(seq) ;
        //     }

        //     GameAudioEngine.playEffect(this.mosquitoDropAudio) ;
        //     if(this._chooseNumber === this._questionNumber) {
        //         this.scheduleOnce(this.answerCorrect, 0.0) ;
        //     }else {
        //         this.scheduleOnce(this.answerWrong, 0.0) ;
        //     }
            
        // }else {
        //     let distance = 0 ;
        //     let x = 0;
        //     let y = 0 ;
        //     while(distance <= 250) {
        //         x = Tools.getRandomFloat(this.guideMosquitoMinX, this.guideMosquitoMaxX) ;
        //         y = Tools.getRandomFloat(this.guideMosquitoMinY + 100, this.guideMosquitoMaxY) ;
        //         distance = Tools.getDistance(this.spray.node.getPosition(), cc.p(x, y)) ;
        //     }

        //     let moveTo = cc.moveTo(0.5, cc.p(x, y)) ;
        //     let callback_1 = cc.callFunc(() =>{
        //         this.spray.armatureName = 'SprayUse' ;
        //         this.spray.playAnimation('SprayUse', 1) ;
        //         GameAudioEngine.playEffect(this.sprayUseAudio) ;
        //     });
        //     let delay = cc.delayTime(0.5) ;
        //     let callback_2 = cc.callFunc(() => {
        //         this.spray.armatureName = 'SprayStop' ;
        //         this.spray.playAnimation('SprayStop', 1) ;
        //         this.killedCount++ ;
        //         this.killMosquito();
        //     });
        //     let seq = cc.sequence(moveTo, callback_1, delay, callback_2) ;
        //     this.spray.node.runAction(seq) ;
        // }
    }

    answerCorrect() {
        console.log('answer correct!') ;
        this.questionIndex++ ;

        //this.guideLayer.removeAllChildren(true) ;
        //this.guideLayer.active = false ;
        this.characterLayer.getComponent(CharacterFox).changeToWinArmature() ;
        console.log(' out answer time :' + this._answerTime ) ;
        GameAudioEngine.playMusic(this.correctNumberAudio[this._questionNumber], false, ()=>{
            console.log('in answer time :' + this._answerTime ) ;
            this.characterLayer.getComponent(CharacterFox).sayGreat() ;
            PlayerController.addCoin( 3 - this._answerTime  + 1 ) ;
            this.gameUI.getComponent(GameUI).addCoinAnim() ;
            this._answerTime  = 0 ;
        }) ;

        this.scheduleOnce(this.checkQuestionEnd, 4.0) ;
    }

    checkQuestionEnd() {
        if(this.questionIndex === this.questionCount) {
            this.changeGameState(this._gameState.STATE_END) ;
        }else {
            if(this._currentGameState === this._gameState.STATE_TEACH) {
                this.changeGameState(this._gameState.STATE_PLAY) ;
            }else {
                this.startTeach() ;
            }
        }
    }

    answerWrong() {
        console.log('answer wrong->' + this._answerTime ) ;
        if(this._answerTime  === 1) {
            this.answerWrongTime_1() ;
        }else if(this._answerTime  === 2) {
            this.answerWrongTime_2() ;
        }else if(this._answerTime  === 3) {

        }
    }

    answerWrongTime_1() {
        if(this._chooseNumber > this._questionNumber) {
            this.characterLayer.getComponent(CharacterFox).changeToCough() ;
            this.scheduleOnce(()=>{
                GameAudioEngine.playMusic(this.choosLargerAudio, false, this.answerWrongTime_1_think.bind(this)) ;
            }, 1.0);
        }else {
            GameAudioEngine.playMusic(this.choosSmallerAudio, false, this.answerWrongTime_1_think.bind(this)) ;
        }
        
    }

    answerWrongTime_1_think() {
        this.scheduleOnce(()=>{
            GameAudioEngine.playMusic(this.thinkAgainAudio, false, this.restartCurrentQuestion.bind(this)) ;
        }, 1.0);
    }

    restartCurrentQuestion() {
        this.guideLayer.removeAllChildren(true) ;
        this.guideLayer.active = false ;

        this.startTeach() ;
    }

    answerWrongTime_2() {
        if(this._chooseNumber < this._questionNumber) {
            GameAudioEngine.playMusic(this.choosSmallerAudio, false, this.restartCurrentQuestion.bind(this)) ;
        }else {
            this.characterLayer.getComponent(CharacterFox).changeToCough() ;
            this.scheduleOnce(()=>{
                GameAudioEngine.playMusic(this.choosLargerAudio, false, this.restartCurrentQuestion.bind(this)) ;
            }, 1.0);
        }
        
    }

    answerWrongTime_3() {
        this.questionIndex++ ;
        this._answerTime  = 0 ;

        this.answerLayer.active = false ;
        this.scheduleOnce(this.checkQuestionEnd, 0.5) ;
    }


    showWinUILayer() {
        this.winLayer.active = true ;
        this.makeQuestionLayer.active = false ;
        this.guideLayer.active = false ;
        this.answerLayer.active = false ;

        this.characterLayer.getComponent(CharacterFox).changeToWinArmature() ;

        cc.director.preloadScene('SoundCountExerciseScene') ;
    }

    restartButtonCallback() {
        cc.director.loadScene('SoundCountExerciseScene') ;
    }

}