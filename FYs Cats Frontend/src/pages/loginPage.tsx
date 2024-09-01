import FormRow from "../utils/formRow"
import { useState, ChangeEvent, FormEvent } from "react"
import "../index.css"
import { useImageContext } from '../components/imageContext';
import { loginService, getRole, sendForgotEmail } from "../components/services";
import { useNavigate} from "react-router-dom";
import { useAuth } from '../components/authContext';
import { useUser} from '../components/adminContext';
import { IoIosArrowBack } from "react-icons/io";
import LocalStates from '../utils/localStates';

export default function login() {
    const {alert, showAlert, hideAlert} = LocalStates()
    const [forgetState, setForgetState] = useState(false)
    const [email, setEmail] = useState('')
    const { setUser } = useUser();
    const navigate = useNavigate();

    const { setId } = useAuth();
    const { currentImage } = useImageContext();
    const defaultImage = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724743874/FYs-Cats/tmp-1-1724743876809_qghgoq.jpg"
    const [loginForm, setLoginForm] = useState({
        userName: "",
        password: ""
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent the default form submission
        if (forgetState) {
            // showAlert({text:'This function is unavailable', type:'danger'})
            // return
            const result = await sendForgotEmail(email)
            if (result === 'true') {
                showAlert({text:'Please check your email', type:'success'})
            }
            else {
                showAlert({text:'Something went wrong, please try again'})
            }
            return;
        }
        
        hideAlert()
        const { userName, password } = loginForm;
        const admin = { userName, password };
    
        const login:string = await loginService(admin);
        const role = await getRole()

        if (login === 'true') {
            setId(userName); // Update the id state in context after login
            setUser(role)
            navigate('/');
        } else {
            showAlert({text: login})
        }
      };
    
    const handleForgetState = () => {
        setLoginForm({userName: '', password:''})
        setEmail('')
        hideAlert()
        setForgetState(!forgetState)
    }
    
    return(
    <div className="login-container" 
        style={{
            backgroundImage: currentImage ? `url(${currentImage.image})` : `url(${defaultImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        }}
        >
        {!forgetState? (
            <form className="login-form" onSubmit={handleSubmit}>
            <h1 className="login-title">Admin Log In</h1>
            <FormRow
                type="text"
                label="Username"
                name="userName"
                value={loginForm.userName}
                handlechange={handleChange}
            />
            <FormRow
                type="password"
                label="Password"
                name="password"
                value={loginForm.password}
                handlechange={handleChange}
            />
            {alert.show &&  (
                <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
            )}
            <button type="submit" className="login-button">Log In</button>
            <span className="forget-link" onClick={handleForgetState}>Forgot Password</span>
        </form>
        ):
        (
            
            <form className="login-form" onSubmit={handleSubmit}>
             <IoIosArrowBack style={{position:'relative', right: '30px', fontSize: '1.5rem', cursor: 'pointer', padding:"5px 10px"}} onClick={handleForgetState}/>   
            <h1 className="login-title">Reset Password</h1>
            <FormRow
                type="email"
                label="Email"
                name="email"
                value={email}
                handlechange={(e) => setEmail(e.target.value)}
            />
            {alert.show &&  (
                <p className={`alert alert-${alert.type}`}>{alert.text}</p>
            )}
            <button type="submit" className="login-button">Send Email</button>
        </form>
        )}
        


    </div>
    )
}