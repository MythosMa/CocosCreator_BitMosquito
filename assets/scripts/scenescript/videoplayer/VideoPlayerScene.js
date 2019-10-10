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
export default class VideoPlayerScene extends cc.Component {


    onLoad() {
        this.videoPlayer = this.getComponent(cc.VideoPlayer) ;
        this.videoPlayer.remoteURL = GameInfo.getVideoUrl() ;

        console.log('url : ' + this.videoPlayer.remoteURL) ;

        this.isLoadVideo = false ;
        this.isStart = false ;
        this.isPlaying = false ;
    }

    videoEvent(videoPlayer, eventType, cunsomEventData) {
        console.log('hhhhh->' + eventType) ;
        switch(eventType) {
        case cc.VideoPlayer.EventType.META_LOADED:
            //this.videoPlayer = videoPlayer ;
            //this.videoPlayer.play() ;
            break ;
        case cc.VideoPlayer.EventType.READY_TO_PLAY:
            this.isLoadVideo = true ;
            break ;
        }
    }

    start() {
        this.isStart = true ;
    }

    update(delta) {
        if(!this.isPlaying) {
            this.videoPlayer.play() ;
            this.isPlaying = true ;
        }
    }
}