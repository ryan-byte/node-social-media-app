import Cookies from "js-cookie";

const userCookieName = "user";
/**
 * This function will redirect the user to the homepage if he is already logged in (can be used in signup page)
 * @param {*} navigate an instance of the useNavigate hook in the react-router-dom 
 * @example 
 * const navigate = useNavigate();
 * useEffect(()=>{
 *      restricted_To_LoggedUsers(navigate);
 * });
*/
function restricted_To_LoggedUsers(navigate){
    let userCookieValue = Cookies.get(userCookieName);
    if (userCookieValue){
        navigate("/");
    }
}
/**
 * This function will redirect the user to the signin page if he is not logged in (can be used in setting page)
 * @param {*} navigate an instance of the useNavigate hook in the react-router-dom 
 * @example 
 * const navigate = useNavigate();
 * useEffect(()=>{
 *      restricted_To_unLoggedUsers(navigate);
 * });
 */
function restricted_To_unLoggedUsers(navigate){
    let userCookieValue = Cookies.get(userCookieName);
    if (userCookieValue === undefined){
        navigate("/signin");
    }
}
/**
 * Removes the cookies used for authentication.
 */ 
async function removeLoginCookies(){
    //remove the cookie that is used by the client
    Cookies.remove(userCookieName);
    //remove the cookie that is used by the server
    await fetch("/logout");
}
function getLoginCookieData(){
    let userCookieValue = Cookies.get(userCookieName);
    if (userCookieValue){
        return JSON.parse(userCookieValue);
    }else{
        return {};
    }
}



export {restricted_To_unLoggedUsers,restricted_To_LoggedUsers,removeLoginCookies,getLoginCookieData};