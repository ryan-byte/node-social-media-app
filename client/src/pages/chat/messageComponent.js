import { memo, useEffect } from "react";

/**
 * simple jsx message component that will show the message as either sent or received.
 * also it is exported as 'memo' so the parent wont rerender this component on every change 
 * @param {String} message
 * @param {String} type should be either (send/receive) so it will set the UI to the right class
 * @returns JSX
 */
function MessageComponent({message,type}){
    return (
        <div>
            {
                type === "send" 
                ? <CreateSendMessageUI message={message} />
                : <CreateReceiveMessageUI message={message} />
            }
        </div>
    )
}

//used memo so the parent wont keep rerendering this component on every change
export default memo(MessageComponent)

//static functions
function CreateSendMessageUI({message}){
    useEffect(()=>{
        const messages = document.getElementById("messages");
        scrollDown(messages);
    })
    return (
        <div className="chat-message-holder">
            <div className="chat-message-currentUser">
                {message}
            </div>
        </div>
    )
}
function CreateReceiveMessageUI({message}){
    //when receiving messages scroll down only if the user is down
    useEffect(()=>{
        const messages = document.getElementById("messages");
        if (messages.offsetHeight + messages.scrollTop >= messages.scrollHeight - 100){
            scrollDown(messages);
        }
    })
    return (
        <div className="chat-message-holder">
            <div className="chat-message-otherUser">
                {message}
            </div>
        </div>
    )
}

function scrollDown(messages){
    messages.scrollTop = messages.scrollHeight;
}