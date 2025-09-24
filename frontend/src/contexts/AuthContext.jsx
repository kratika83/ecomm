// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API } from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')) || { items: [] });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        if (token) localStorage.setItem('token', token);
        else localStorage.removeItem('token');

        if (user) localStorage.setItem('user', JSON.stringify(user));
        else localStorage.removeItem('user');
    }, [token, user]);

    const register = async (name, email, password) => {
        const res = await axios.post(`${API}/api/users/auth/register`, { name, email, password });
        setUser(res.data.user);
        // server created empty cart; fetch cart
        const cartResp = await axios.get(`${API}/api/cart`, { headers: { Authorization: `Bearer ${res.data.token}` } });
        setCart(cartResp.data);
        return res.data;
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API}/api/users/auth/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        // Merge local cart if exists
        const local = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        console.log(local, 'local--');
        if (local.items && local.items.length > 0) {
            // send merge payload
            await axios.post(`${API}/api/cart/merge`, {
                items: local.items.map(i => ({ itemId: i.itemId, qty: i.qty }))
            }, { headers: { Authorization: `Bearer ${res.data.token}` } });
        }
        // fetch merged cart
        const cartResp = await axios.get(`${API}/api/cart`, { headers: { Authorization: `Bearer ${res.data.token}` } });
        console.log(cartResp.data, 'cartresp--');
        setCart(cartResp.data);
        return res.data;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        // keep cart in localStorage so items persist for next login (requirement)
        // but update local cart variable to what is in localStorage
        const local = JSON.parse(localStorage.getItem('cart')) || { items: [] };
        setCart(local);
    };

    // Add to cart: if logged in call server, else add to local cart
    const addToCart = async (itemId, qty = 1) => {
        if (!token) {
            // guest cart: keep minimal shape { items: [{ itemId, qty, title, price }] }
            const existing = cart.items.find(i => i.itemId === itemId);
            if (existing) existing.qty += qty;
            else cart.items.push({ itemId, qty });
            const newCart = { ...cart, items: [...cart.items] };
            setCart(newCart); // saved to localStorage by useEffect
            return newCart;
        }
        const res = await axios.post(`${API}/api/cart/add`, { itemId, qty }, { headers: { Authorization: `Bearer ${token}` } });
        setCart(res.data);
        localStorage.setItem('cart', JSON.stringify(res.data)); // keep local in-sync
        return res.data;
    };

    const removeFromCart = async (itemId) => {
        if (!token) {
            const newItems = cart.items.filter(i => i.itemId !== itemId);
            const newCart = { items: newItems };
            setCart(newCart);
            return newCart;
        }
        const res = await axios.post(`${API}/api/cart/remove`, { itemId }, { headers: { Authorization: `Bearer ${token}` } });
        setCart(res.data);
        localStorage.setItem('cart', JSON.stringify(res.data));
        return res.data;
    };

    return (
        <AuthContext.Provider value={{ user, token, cart, register, login, logout, addToCart, removeFromCart }}>
            {children}
        </AuthContext.Provider>
    );
};