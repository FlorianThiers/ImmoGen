type User = {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
};

interface ProfilePageProps {
  user?: User | null;
}


const UserInfo: React.FC<ProfilePageProps> = ({ user }) => {

  return (
    <div className="user-info">
      <img
          src="/profileImg.png"
          alt="profielfoto"
          className="profile-img"
        />
      {user ? (
          <div className="profile-info">
            <h1 className="profile-name">
                {user.username.charAt(0).toUpperCase() + user.username.slice(1)}
            </h1>
            <p><strong>Email: </strong> {user.email}</p>
            <div className="rol"><strong>Rol: </strong> 
              {user?.is_admin === true && (
                <p> Admin</p>
              )}
              {user?.is_admin === false && (
                <p >User</p>
              )} 
            </div>
            <button className="edit-profile-btn">Profiel bewerken</button>
          </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}   

export default UserInfo;