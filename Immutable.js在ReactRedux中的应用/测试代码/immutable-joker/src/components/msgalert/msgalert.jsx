import React from "react";
import ReactDOM from "react-dom";
import "./msgalert.scss";
class AlertBox extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            opacity:0,
        };
    }
    componentDidMount(){
        let autoTime=setInterval(()=>{
            this.setState({
                opacity:this.state.opacity+0.1
            });
            if(this.state.opacity>1){
                this.setState({
                    opacity:1
                });
                clearInterval(autoTime);
                if(this.props.fade){
                    setTimeout(()=>{
                        let autoTimeEnd=setInterval(()=>{
                            this.setState({
                                opacity:this.state.opacity-0.1
                            });
                            if(this.state.opacity<0){
                                this.setState({
                                    opacity:0
                                });
                                clearInterval(autoTimeEnd);
                                document.body.removeChild(document.getElementById(this.props.parentID))
                            }
                        },this.props.timeout)
                    },600)
                }
            }
        },this.props.timeout);
    }
    render(){
        let {opacity}=this.state;
        return(
            <div className="modalOuter" ref="msgModal" style={{opacity:opacity}}>
                <div>
                    <span className="closeTips"/>
                    <p>
                        <img src={require("./tips.png")}/>
                        {this.props.msg}
                        </p>
                </div>
            </div>
        )
    }
}
class MsgAlert{
    static showMsg(item){
        let parentDOM=document.createElement("div"),
            parentID=parseInt(Math.random()*10).toString();
        parentDOM.id=parentID;
        document.body.appendChild(parentDOM);
        ReactDOM.render(
            <AlertBox {...item} parentID={parentID}/>,
            document.getElementById(parentID)
        );
    }
}

export default MsgAlert
