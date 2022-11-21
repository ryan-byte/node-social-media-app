import {useEffect,useState} from "react"

/**
 * makes a get request to a url then return a json data, error is undefined by default but if an
 * error occured it will change to a string, loading is either true or false (true if the request is still ongoing, false otherwise)
 * @param {String} url 
 * @returns Object: {data,error,loading}
 */
export default function useFetch(url){
    const [data,setData] = useState(undefined);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(undefined);

    useEffect(()=>{
        async function getUserDetails(){
            setLoading(true);
            try{
                let request = await fetch(url,{
                    method: "GET"
                })
                let jsonData = await request.json();
                setData(jsonData)
            }catch (err){
                setError("error has occured");
                console.error(err.message);
            }
            setLoading(false);
        };
        getUserDetails();
    },[url]);

    return {data,loading,error};
}