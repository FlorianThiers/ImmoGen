import axios from "axios";
import { useState, useEffect } from "react";

import User from "../../context/User";

interface AdminsProps {
  user?: User | null;
}

const Admins: React.FC<AdminsProps> = ({ user }) => {

    const [users, setUsers] = useState<User[]>([]);
    const [admins, setAdmins] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/users`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                setUsers(response.data);
            } catch (error) {
                console.error("Failed to fetch users:", error);
            }
        };
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) && searchTerm
    );


  return (
    <div className="admins">
      <h2 className="text-xl font-bold mt-6">Beheer Admins</h2>
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          placeholder="Zoek gebruikersnaam..."
          className="border px-2 py-1 rounded w-64"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={async () => {
            const userToPromote = users.find(
            (u) => u.username?.toLowerCase() === searchTerm.toLowerCase()
            );
            if (!userToPromote) {
            alert("Gebruiker niet gevonden.");
            return;
            }
            try {
            const token = localStorage.getItem("token");
            await axios.post(
                `${import.meta.env.VITE_API_URL}/make_admin/${userToPromote.id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // Update lokaal de users state
            setUsers((prev) =>
                prev.map((u) =>
                u.id === userToPromote.id ? { ...u, is_admin: true } : u
                )
            );
            alert("Gebruiker is nu admin.");
            } catch (error) {
            alert("Fout bij het promoten van gebruiker.");
            }
        }}
        >
        Maak Admin
        </button>
        {searchTerm && filteredUsers.length > 0 && (
            <ul className="search-suggestions">
                {filteredUsers.slice(0, 8).map(user => (
                <li
                    className="admin-users"
                    key={user.id}
                    onMouseDown={() => setSearchTerm(user.username || "")}
                >
                    {user.username} {user.is_admin && <span className="admin-user-names">(admin)</span>}
                </li>
                ))}
            </ul>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Huidige Admins:</h3>
        <ul className="list-disc pl-5">
        {users
            .filter((u) => u.is_admin)
            .map((admin) => (
            <li key={admin.id}>{admin.username}</li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Admins;
