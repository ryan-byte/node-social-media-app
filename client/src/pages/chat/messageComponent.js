import { memo } from "react";

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
                type === "send" ? 
                create_sendMessageUI(message):
                create_receiveMessageUI(message)
            }
        </div>
    )
}

//used memo so the parent wont keep rerendering this component on every change
export default memo(MessageComponent)

//static functions
function create_sendMessageUI(message){
    return (
        <div className="chat-message-holder">
            <div className="chat-message-currentUser">
                {message}
            </div>
        </div>
    )
}
function create_receiveMessageUI(message){
    return (
        <div className="chat-message-holder">
            <div className="chat-message-otherUser">
                {message}
            </div>
        </div>
    )
}