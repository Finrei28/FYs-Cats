import { Link, useNavigate } from 'react-router-dom';
import '../index.css'
import { logout } from './services';
import { useAuth  } from './authContext';
import { useUser } from './adminContext';

type NavBarProp = {
    setHomeFirstRender: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({setHomeFirstRender}: NavBarProp) {
    const {user, setUser} = useUser()
    const { name, setName } = useAuth(); // Initialize as null
    const navigate = useNavigate()
    const getGreeting = (): string => {
    const currentHour = new Date().getHours();

    
      
    if (currentHour >= 5 && currentHour < 12) {
          return "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
          return "Good Afternoon";
        } else if (currentHour >= 18 && currentHour < 22) {
          return "Good Evening";
        } else {
          return "Good Night";
        }
      };

    const handleHomeClick = () => {
        setHomeFirstRender(true);
 
    };

    const handleLogout = async () => {
        await logout();
        setName(null);
        setUser(null)
        navigate('/')
    };
    
    return (
        <nav className='navbar'>
            <div className='taskbar-items'>
                <Link to="/">
                    <span onClick={handleHomeClick}>Home</span>
                </Link>
                <Link to="/fullCollection">
                    <span>Full Collection</span>
                </Link>
                <Link to="/aboutUs">
                    <span>About Us</span>
                </Link>
            </div>
            {!user ? (
                <div className='sign-in-nav'>
                    <Link to="/login">
                        <span className='sign-in-button'>Sign In</span>
                    </Link>
                </div>
            ) : (
                <div className='rightside-nav'>
                    <span className='greeting-nav'>{getGreeting()} {name} </span>
                    <span className='log-out-nav' onClick={handleLogout}>Log Out</span>
                </div>
            )}
        </nav>
    );
}
