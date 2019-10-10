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

export const CONNECT_HOST = 'http://101.200.126.9:8787/'   ;
export const LOGIN_URL = '/api/user/session' ;

class NetworkEngine {
    constructor() {
        this._connectDomain = null ;
    }

    setConnectDomain(domain) {
        this._connectDomain = domain ;
    }

    getConnectDomain() {
        return this._connectDomain ;
    }

    connectServerGet(tag, url, postData, token, successCallback, failCallback) {
        let myXmlHttpRequest = new XMLHttpRequest() ;
        myXmlHttpRequest.onreadystatechange = () => {
            if(myXmlHttpRequest.readyState === 4) {
                if(myXmlHttpRequest.status === 200) {
                    if(successCallback) {
                        successCallback(myXmlHttpRequest.responseText) ;
                    }
                }
            }
        } ;

        myXmlHttpRequest.open('GET', url, true) ;
        myXmlHttpRequest.send() ;
    }

    connectServerPost(tag, url, postData, token, successCallback, failCallback) {
        let myXmlHttpRequest = new XMLHttpRequest() ;
        myXmlHttpRequest.onreadystatechange = () => {
            if(myXmlHttpRequest.readyState === 4) {
                if(myXmlHttpRequest.status === 200) {
                    if(successCallback) {
                        console.log('response : ' + myXmlHttpRequest.responseText) ;
                        successCallback(myXmlHttpRequest.responseText) ;
                    }
                }
            }
        } ;

        myXmlHttpRequest.open('POST', url, true) ;
        myXmlHttpRequest.setRequestHeader("Content-Type","application/json");
        // myXmlHttpRequest.setRequestHeader('Access-Control-Allow-Origin', '*') ;
        // for(let key in postData) {
        //     console.log('key : ' + key + '|value : ' + postData[key]) ;
        //     myXmlHttpRequest.setRequestHeader(key, postData[key]) ;
        // }
        myXmlHttpRequest.send(JSON.stringify(postData)) ;

    }
}

export default new NetworkEngine() ;
