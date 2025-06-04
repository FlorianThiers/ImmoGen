import React, { useContext } from 'react';


const UserEstimates = () => {
    
    return (
        <div className="profile-table-container">
            <h2>Mijn schattingen</h2>
            <table className="profile-table">
                <thead>
                <tr>
                    <th>Adres</th>
                    <th className="right">Waarde</th>
                    <th className="center">Type</th>
                    <th className="center">Streek</th>
                </tr>
                </thead>
                <tbody>
                {/* {user && user.estimates.map((e) => (
                    <tr key={e.id}>
                    <td>{e.address}</td>
                    <td className="right">€{e.value.toLocaleString()}</td>
                    <td className="center">{e.type}</td>
                    <td className="center">{e.region}</td>
                    </tr>
                ))} */}
                </tbody>
            </table>
        </div>
    );
}

export default UserEstimates;

