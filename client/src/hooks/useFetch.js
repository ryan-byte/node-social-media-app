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
        async function getData(){
            setData(undefined);
            setLoading(true);
            try{
                setError(undefined);
                let request = await fetch(url,{
                    method: "GET"
                })
                if (request.ok){
                    let jsonData = await request.json();
                    setData(jsonData)
                }else{
                    throw new Error(request.status);
                }
            }catch (err){
                if (err.message === "404"){
                    setError("Not Found");
                }else if (err.message === "400"){
                    setError("Bad Request");
                }
                else{
                    setError("error has occured");
                    console.error(err.message);
                }
            }
            setLoading(false);
        };
        getData();
    },[url]);

    return {data,loading,error};
}