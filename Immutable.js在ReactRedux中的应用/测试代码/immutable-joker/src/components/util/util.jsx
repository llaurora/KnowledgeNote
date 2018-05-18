import "whatwg-fetch";
import {fromJS} from "immutable";
import MsgAlert from "../msgalert/msgalert.jsx";

export default {
    msgAlert(msg){//消息提示弹框
        MsgAlert.showMsg({
            msg:msg,
            timeout:20,
            fade:true
        })
    },
    fetchHandler(payload){//fetch请求封装
        let _this=this;
        function setOptions(payload){
            let headers = payload.headers ? payload.headers : {"Content-Type":"application/json;charset=utf-8"},
                body = payload.body || {};
            return {
                url: payload.url,
                method: payload.type || "post",
                credentials: "include",
                headers,
                body:(payload.type==="get" ||payload.type==="head") ? undefined : JSON.stringify(body)
            }
        }
        function checkStatus(response){
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                _this.msgAlert(response.statusText);
                let error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }
        function parseJSON(response) {
            return response.json()
        }
        const options = setOptions(payload);
        return fetch(options.url,options)
            .then(checkStatus)
            .then(parseJSON)
            .then((data)=>{
                return data.code!==1 ? Promise.reject(data) : payload.success ? payload.success(fromJS(data.body)) : fromJS(data.body)
            }).catch((data)=>{
                return payload.error ? payload.error(data) : (_this.msgAlert(data.errorMsg),console.log("request failed"),Promise.reject(fromJS(data)));
            })
    },
    filterMerge(src,target) {
        return src.mapEntries(([key,value])=>(target.has(key) ? [key,target.get(key)] : [key,value]))
    }
};
