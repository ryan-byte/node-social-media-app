import { ReactComponent as General } from  '../../assets/svg/Setting.svg';
import { ReactComponent as Security } from  '../../assets/svg/Security.svg';

export default function Sidebar(){
    return (
        <div className="sidebar">
            <a className="active" href="#General"> 
                <General className="small-icon"/> 
                <span> General</span>
            </a>
            <a href="#Security"> 
                <Security className="small-icon"/> 
                <span> Security</span>
            </a>
        </div>
    )
}