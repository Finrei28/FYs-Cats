import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import '../index.css';
import { logout } from './services';
import { useAuth } from './authContext';
import { useUser } from './adminContext';

type NavBarProp = {
    setHomeFirstRender: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Navbar({ setHomeFirstRender }: NavBarProp) {
    const { user, setUser } = useUser();
    const { name, setName } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getGreeting = (): string => {
        const currentHour = new Date().getHours();

        if (currentHour >= 5 && currentHour < 12) {
            return 'Good Morning';
        } else if (currentHour >= 12 && currentHour < 18) {
            return 'Good Afternoon';
        } else if (currentHour >= 18 && currentHour < 22) {
            return 'Good Evening';
        } else {
            return 'Good Night';
        }
    };

    const handleHomeClick = () => {
        setHomeFirstRender(true);
        toggleMenu();
    };

    const handleLogout = async () => {
        await logout();
        setName(null);
        setUser(null);
        navigate('/');
        toggleMenu();
    };

    const toggleMenu = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                // Delay closing to allow any state changes from toggling the menu
                timeoutRef.current = setTimeout(() => {
                    setIsMenuOpen(false);
                }, 100); // 100ms delay to ensure menu toggle has been processed
            }
        };

        // Add event listener for clicks outside the dropdown
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [dropdownRef]);

    return (
        <nav className="navbar">
            <div className="taskbar-items">
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
                <div className="sign-in-nav">
                    <Link to="/login">
                        <span className="sign-in-button">Sign In</span>
                    </Link>
                </div>
            ) : (
                <div className="rightside-nav">
                    <span className="greeting-nav">{getGreeting()} {name}</span>
                    <span className="log-out-nav" onClick={handleLogout}>Log Out</span>
                </div>
            )}
            {/* greeting for mobiles */}
            {user && <span className="mobile-greeting-nav">{getGreeting()} {name}</span>}
            
            
            {/* Hamburger Icon */}
            <div className="hamburger" onClick={toggleMenu} ref={dropdownRef}>
                &#9776;
            </div>

            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                    <Link to="/" onClick={handleHomeClick}>
                        Home
                    </Link>
                    <Link to="/fullCollection" onClick={toggleMenu}>
                        Full Collection
                    </Link>
                    <Link to="/aboutUs" onClick={toggleMenu}>
                        About Us
                    </Link>
                    {!user ? (
                        <Link to="/login" onClick={toggleMenu}>
                            Sign In
                        </Link>
                    ) : (
                        <>
                            <span onClick={handleLogout}>Log Out</span>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
