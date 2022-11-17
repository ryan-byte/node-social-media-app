/**
 * a JSX div element that will show an alert message when the given value is different then "undefined"
 * 
 * @param {string} message text shown in the error element
 * @return JSX code
 * 
 */

export default function ErrorOutput({message}){
    return (
        <div>
            {message && <div className="alert alert-danger" style={{whiteSpace:'pre-line'}} role="alert"> {message} </div>}       
        </div>
    )
}