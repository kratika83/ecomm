// frontend/src/components/ItemCard.jsx
import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function ItemCard({ item, onAdd }) {
    return (
        <Card>
            {
                item.image && <Card.Img variant="top" src={item.image} style={{ height: 160, objectFit: 'cover' }} />
            }
            <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text style={{ minHeight: 40 }}>{item.description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                    <strong>₹{item.price}</strong>
                    <Button variant="primary" onClick={onAdd}>Add to cart</Button>
                </div>
            </Card.Body>
        </Card>
    );
}