const FriendsObjectName = "friends";

/**
 * this script will update the friends object stored in the localstorage
 */
async function UpdateFriends(){
    const response = await fetch("/user/friends");
    const data = await response.json();
    localStorage.setItem(FriendsObjectName,JSON.stringify(data));
}

/**
 * deletes the friends object stored in the localstorage
 */
function DeleteFriends(){
    localStorage.removeItem(FriendsObjectName);
}

/**
 * gets the friends object stored in the localstorage
 */
function GetFriends(){
    return localStorage.getItem(FriendsObjectName);
}

export {UpdateFriends,DeleteFriends,GetFriends}