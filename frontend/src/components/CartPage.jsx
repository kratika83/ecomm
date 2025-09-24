// frontend/src/components/CartPage.jsx
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { API } from '../api';

export default function CartPage() {
    const { cart, token, removeFromCart } = useContext(AuthContext);
    const [detailedCart, setDetailedCart] = useState(cart);

    useEffect(() => {
        setDetailedCart(cart);
    }, [cart]);

    // If guest cart stores only itemId+qty, we may want to fetch item details for display.
    // For simplicity: if server cart returned populated items, it contains items[*].item.title, price
    return (
        <div>
            <h3>Your Cart</h3>
            {(detailedCart?.items || []).length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <Table>
                    <thead><tr><th>Product</th><th>Price</th><th>Qty</th><th>Action</th></tr></thead>
                    <tbody>
                        {detailedCart.items.map(it => {
                            const item = it.item || { title: 'Unknown', price: 0, _id: it.itemId || '' };
                            return (
                                <tr key={item._id}>
                                    <td>{item.title}</td>
                                    <td>₹{item.price}</td>
                                    <td>{it.qty}</td>
                                    <td>
                                        <Button size="sm" variant="danger" onClick={() => removeFromCart((item._id ? item._id : it.itemId))}>
                                            Remove
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            )}
        </div>
    );
}