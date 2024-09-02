import FormRow from "../utils/formRow"
import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import "../index.css"
import { useImageContext } from '../components/imageContext';
import { loginService, sendForgotEmail } from "../components/services";
import { useNavigate} from "react-router-dom";
import { useAuth } from '../components/authContext';
import { useUser} from '../components/adminContext';
import { IoIosArrowBack } from "react-icons/io";
import LocalStates from '../utils/localStates';
import { MdMarkEmailRead } from "react-icons/md";

export default function login() {
    const { setUser } = useUser();
    const { setId } = useAuth();
    const {alert, showAlert, hideAlert} = LocalStates()
    const [forgetState, setForgetState] = useState(false)
    const [email, setEmail] = useState('')
    const [sentEmail, setSendEmail] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();
    const { currentImage } = useImageContext();
    const defaultImage = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724743874/FYs-Cats/tmp-1-1724743876809_qghgoq.jpg"
    const [loginForm, setLoginForm] = useState({
        userName: "",
        password: ""
    })

    useEffect(() => {
        if (localStorage.getItem('name')) {
            navigate('/')
        }
    },[])

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
            // return\
            if (!email) {
                showAlert({text: `Please provide an email`})
                return
            }
            setSendEmail(true)
            const result = await sendForgotEmail(email)
            if (result === 'true') {
                showAlert({text:'Please check your email', type:'success'})
            }
            else {
                showAlert({text: result})
            }
            return;
        }
        
        hideAlert()
        const { userName, password } = loginForm;
        const admin = { userName, password };
    
        const login = await loginService(admin);

        if (login?.success === 'true') {
            setId(login.name);
            setUser(login.role)
            navigate('/');
        } else {
            showAlert({text: login?.error})
        }
      };
    
    const handleForgetState = () => {
        setLoginForm({userName: '', password:''})
        setEmail('')
        hideAlert()
        setForgetState(!forgetState)
    }

    const handleResendEmail = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsButtonDisabled(true);
        setTimer(60);
        const result = await sendForgotEmail(email)
            if (result === 'true') {
                showAlert({text:'Email has been resent', type:'success'})
            }
            else {
                showAlert({text: result})
            }
    }

    useEffect(() => {
        if (timer > 0) {
          const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1);
          }, 1000);
    
          // Clean up the interval on component unmount
          return () => clearInterval(countdown);
        } else {
          // Re-enable the button when the timer reaches 0
          setIsButtonDisabled(false);
        }
      }, [timer]);
    
    return(
    <div className="login-container" 
        style={{
            backgroundImage: currentImage ? `url(${currentImage.image})` : `url(${defaultImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center'
        }}
        >
        { sentEmail ? (
            <form className="login-form" onSubmit={handleResendEmail}> 
                <h1 className="login-title">Email Sent</h1>
                <MdMarkEmailRead className="mail-icon"/>
                <p>Please follow the instructions to reset your password</p>
                {alert.show &&  (
                    <p className={`alert alert-${alert.type}`}>{alert.text}</p>
                )}
                <button type="submit" className="login-button" disabled={isButtonDisabled}>
                {isButtonDisabled ? `Resend Email (${timer})` : 'Resend Email'}
      </button>
            </form>
        ) :
        !forgetState? (
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