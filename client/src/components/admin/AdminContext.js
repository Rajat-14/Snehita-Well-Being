import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../services/helper';

const AdminContext = createContext({ isAdmin: false, checkingAdmin: true });

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/admin/verify`, { withCredentials: true })
      .then(() => setIsAdmin(true))
      .catch(() => setIsAdmin(false))
      .finally(() => setCheckingAdmin(false));
  }, []);

  const logout = async () => {
    try {
      await axios.get(`${BASE_URL}/api/admin/logout`, { withCredentials: true });
    } catch (_) {}
    setIsAdmin(false);
  };

  return (
    <AdminContext.Provider value={{ isAdmin, checkingAdmin, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
