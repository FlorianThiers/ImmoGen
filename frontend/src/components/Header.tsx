import '../pages/Users/dashboard.css';
import SearchBar from './header/SearchBar';
import NotificationCenter from './header/Notifications';

type HeaderProps = {
    title: string;
    user?: { username: string; email: string };
    onUserClick?: () => void;

};

const Header = ({ title, user }: HeaderProps) => {
    const initials = user
        ? (() => {
            const parts = user.username.trim().split(" ");
            if (parts.length === 1) {
                return parts[0].substring(0, 2).toUpperCase();
            }
            return parts.map((n) => n[0]).join("").substring(0, 2).toUpperCase();
        })()
        : "US";

    return (
            <header className="header">
                <h1 className="page-title">{title}</h1>
                <div className="header-right">
                    <SearchBar/>
                    <div className="header-user">
                        <NotificationCenter/>
                        <div
                            className="user-profile"
                            // onClick={onUserClick}
                            style={{ cursor: "pointer" }}
                        >
                            <span className="user-avatar">{initials}</span>
                        </div>
                    </div>
                </div>
            </header>
    );
};

export default Header;