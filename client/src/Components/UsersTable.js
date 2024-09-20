import React, { useEffect, useState } from 'react';

function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('/users')
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Age</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.email}>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.age}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default UsersTable;
