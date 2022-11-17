/**
 * JSX input field of the type email
 * 
 * @param {string} label text shown on the label tag
 * @param {string} attributs text that will be set to the id,name of the input field and the htmlFor of the label tag
 * @param {string} value the value shown on the input (recommend to use the useState hook)
 * @param {function} setValue a function that will change the value (recommend to use the useState hook)
 * @return JSX code
 * 
 */

export default function EmailInput({label,attributs,value,setValue}){
    return (
        <div className="mb-3">
            <label htmlFor={attributs} className="form-label">{label}</label>
            <input value={value} onChange={(ev)=>setValue(ev.target.value)} required type="email" className="form-control" name={attributs} id={attributs}/>
        </div>
    )
}