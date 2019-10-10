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

class GameAudioEngine {
    constructor() {
        this._volume = 1.0 ;
        this._effectVolume = 1.0 ;
        this._bgmID = -1 ;
    }

    playMusic(audio, isLoop, playEndCallback) {
        let audioID = cc.audioEngine.play(audio, isLoop, this._volume) ;
        if(playEndCallback) {
            cc.audioEngine.setFinishCallback(audioID, playEndCallback) ;
        }

        return audioID ;
    }

    stopMusic(audioID) {
        cc.audioEngine.stop(audioID) ;
    }

    pauseMusic(audioID) {
        cc.audioEngine.pause(audioID) ;
    }

    pauseAllMusic() {
        cc.audioEngine.pauseAll() ;
    }

    resumeMusic(audioID) {
        cc.audioEngine.resume(audioID) ;
    }

    resumeAllMusic() {
        cc.audioEngine.resumeAll() ;
    }

    playEffect(effectAudio) {
        cc.audioEngine.play(effectAudio, false, this._effectVolume) ;
    }

    playBGM(audioBGM) {
        this.stopBGM() ;
        this._bgmID = cc.audioEngine.play(audioBGM, true, this._volume) ;
        console.log('playBGM bgm id : ' + this._bgmID) ;
    }

    pauseBGM() {
        if(this._bgmID >= 0) {
            cc.audioEngine.pause(this._bgmID) ;
        }
    }

    resumeBGM() {
        if(this._bgmID >= 0) {
            cc.audioEngine.resume(this._bgmID) ;
        }
    }

    stopBGM() {
        if(this._bgmID >= 0) {
            cc.audioEngine.stop(this._bgmID) ;
            this._bgmID = -1 ;
        }
    }
}

export default new GameAudioEngine() ;
