/**
 * Post a urlencoded form data to a url.
 *
 * @param {string} url  the specific url to post data to
 * @param {Object} data the data that will be posted to the url 
 * @returns {Object} Response.
 * 
 * @example
 * url = "/api/products"
 * url = "http://mydomain.com/api/products"
 * 
 * var data = {
        'email': 'example@gmail.com',
        'password': '123456'
    };
 * 
 */

export default async function postData(url,data={},method = "POST"){
    var formBody = [];
    for (var property in data) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(data[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    let request = await fetch(url,{
        method,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody
    })

    return request;
}