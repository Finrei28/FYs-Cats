import { useImageContext } from '../components/imageContext';
import FormRow from "../utils/formRow"
import { useState, ChangeEvent, FormEvent, ClipboardEvent, useEffect } from "react"
import {createAccountAPI, verifyEmailAPI, resendVerificationCodeAPI} from '../components/services'
import LocalStates from '../utils/localStates';
import Message from '../utils/message';
import { MdMarkEmailRead } from "react-icons/md";
import "../index.css"
import { useNavigate } from 'react-router-dom';

export default function createAccount() {
    const { currentImage } = useImageContext();
    const navigate = useNavigate()
    const defaultImage = "https://res.cloudinary.com/dpwtcr4cz/image/upload/v1724743874/FYs-Cats/tmp-1-1724743876809_qghgoq.jpg"
    const {alert, showAlert, hideAlert, success, setSuccess, setError} = LocalStates()
    const [message, setMessage] = useState('');
    const [verifyEmail, setVerifyEmail] = useState(false)
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [timer, setTimer] = useState(0);
    const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', ''])
    const [formData, setFormData] = useState({
        userName: '',
        password: '',
        confirmPassword: '',
        email: '',
        name: '',
    })
    const [isShowPassword, setIsShowPassword] = useState(false)

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index?: number) => {
        if (verifyEmail && (index || index === 0)) {
            const value = e.target.value;
            const newCode = [...verificationCode];
            newCode[index] = value;

            // Move to the next input if value is filled
            if (value && index < verificationCode.length - 1) {
                const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement;
                if (nextInput) nextInput.focus();
            }
    
            // Move to the previous input if value is deleted
            if (!value && index > 0) {
                const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement;
                if (prevInput) prevInput.focus();
            }

            setVerificationCode(newCode);
        }
        else {
            setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, verificationCode.length).split('');
        const newCode = [...verificationCode];

        pasteData.forEach((char, i) => {
            newCode[i] = char;
            const input = document.getElementById(`code-input-${i}`) as HTMLInputElement;
            if (input) input.value = char;
        });

        setVerificationCode(newCode);

        // Focus on the next input box after pasting
        const nextInputIndex = pasteData.length < verificationCode.length ? pasteData.length : verificationCode.length - 1;
        const nextInput = document.getElementById(`code-input-${nextInputIndex}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
    };

    const checkPassword = (password: string) => {
        const hasSpecialCharacters = /[!@#$%^&*(),.?":{}|<>]/.test(password)
        const hasNumbers = /\d/.test(password)
        const hasLetters = /[a-zA-Z]/.test(password)
        const length = password.length >= 8

        return ({hasSpecialCharacters, hasNumbers, hasLetters, length})
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        hideAlert()
        const {userName, password, confirmPassword, email, name} = formData
        console.log(verifyEmail)
        if (verifyEmail) {
            let code = ''
            verificationCode.forEach(element => {
                code += element
            })
            const verification = await verifyEmailAPI(userName, code)
            if (verification.success === 'true') {
                setSuccess(true)
                setMessage('You have successfully verified your email, redirecting to sign in page')
                setFormData({
                    userName: '',
                    password: '',
                    confirmPassword: '',
                    email: '',
                    name: '',
                })
                setVerificationCode(['', '', '', '', '', ''])
                setTimeout(() => {
                    navigate('/login')
                }, 3000);
                return
            }
            else {
                showAlert({text:`${verification.error}`, type:'danger'})
                return
            }
        }
        if (!userName || !password || !confirmPassword || !email || !name) {
            showAlert({text:'Please fill all fields', type:'danger'})
            return
        }
        if (userName.length < 8) {
            showAlert({text:'Username needs to be at least 8 characters long', type:'danger'})
            return
        }
        const hasLetters = checkPassword(formData.password).hasLetters
        const hasNumbers = checkPassword(formData.password).hasNumbers
        const hasSpecialCharacters = checkPassword(formData.password).hasSpecialCharacters
        const length = checkPassword(formData.password).length
        if (!hasLetters || !hasNumbers || !hasSpecialCharacters || !length) {
            showAlert({text:'Password requirement not met', type:'danger'})
            return
        }

        if (formData.confirmPassword !== formData.password) {
            showAlert({text:'Passwords do not match', type:'danger'})
            return
        }
        const user = {userName, password, email, name}
        const result = await createAccountAPI(user);
        if (result.success === 'false') {
            showAlert({text:`${result.error}`, type:'danger'})
            return
        }
        else {
            setVerifyEmail(true)
        }
    }

    const handleResendEmail = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsButtonDisabled(true);
        setTimer(60);
        const result = await resendVerificationCodeAPI(formData.userName)
        if (result.success === 'true') {
            showAlert({text:'Email has been resent', type:'success'})
        }
        else {
            showAlert({text:result.error, type:'danger'})
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

    return (
        <div className="login-container" 
            style={{
                backgroundImage: currentImage ? `url(${currentImage.image})` : `url(${defaultImage})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center'
            }}
            >
                {!verifyEmail? (
                    <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="title">Create an Account</h1>
                    <FormRow
                        type="text"
                        label="Username"
                        name="userName"
                        value={formData.userName}
                        handlechange={handleChange}
                    />
                    <FormRow
                        type='text'
                        label="Name"
                        name="name"
                        value={formData.name}
                        handlechange={handleChange}
                    />
                    <FormRow
                        type='email'
                        label="Email"
                        name="email"
                        value={formData.email}
                        handlechange={handleChange}
                    />
                    <FormRow
                        type={!isShowPassword ? "password" : "text"}
                        label="Password"
                        name="password"
                        value={formData.password}
                        handlechange={handleChange}
                    />
                    {formData.password && <span className="criteria-container">
                        <span className={!checkPassword(formData.password).hasLetters ? "criteria" : "criteria met"}>Letter</span>
                        <span className={!checkPassword(formData.password).hasNumbers ? "criteria" : "criteria met"}>Number</span>
                        <span className={!checkPassword(formData.password).hasSpecialCharacters ? "criteria" : "criteria met"}>Special Character</span>
                        <span className={!checkPassword(formData.password).length ? "criteria" : "criteria met"}>At Least 8 Characters</span>
                    </span>}
                    
                    <FormRow
                        type={!isShowPassword ? "password" : "text"}
                        label="Confirm Password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        handlechange={handleChange}
                    />
                    <div className="show-password-container">
                        <label htmlFor="showpassword">Show Password</label>
                        <input
                            className="showpassword"
                            type="checkbox"
                            name="showpassword"
                            checked={isShowPassword}
                            onChange={() => setIsShowPassword(!isShowPassword)}
                        />
                    </div>
                    {alert.show &&  (
                        <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
                    )}
                    <button type="submit" className="login-button">Create Account</button>
                    <span onClick={() => navigate('/login')} className="forget-link">Log In</span>
                </form>

                )
                :
                (
                    <form className="login-form" onSubmit={handleSubmit}>
                    <h1 className="title">Email Verification</h1>
                    <MdMarkEmailRead className="mail-icon"/>
                    <p>Please enter the verification code sent to your email</p>
                    <div className="verification-code">
                        {verificationCode.map((value, index) => (
                            <input
                                key={index}
                                id={`code-input-${index}`}
                                type="text"
                                value={value}
                                onChange={(e) => handleChange(e, index)}
                                onPaste={handlePaste}
                                maxLength={1} // Ensuring only one character can be entered
                                className="code-box"
                            />
                        ))}
                    </div>
                    {alert.show &&  (
                        <p className={`loginAlert alert-${alert.type}`}>{alert.text}</p>
                    )}
                    <button type="submit" className="login-button">Verify Email</button>
                    <button className="login-button" disabled={isButtonDisabled} onClick={handleResendEmail}>
                        {isButtonDisabled ? `Resend Email (${timer})` : 'Resend Email'}
                    </button>
                </form>
                )}
            
            <div>
                {(success) && <Message message={message} setMessage={setMessage} setsuccess={setSuccess} success={success} setError={setError}/>}
            </div>
        </div>
    )
}