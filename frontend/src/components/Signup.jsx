// frontend/src/components/Signup.jsx
import React, { useState, useContext } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/items');
        } catch (err) {
            alert(err.response?.data?.message || 'Error');
        }
    };

    return (
        <Card className="p-3">
            <h3>Sign up</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-2">
                    <Form.Label>Name</Form.Label>
                    <Form.Control value={name} onChange={e => setName(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Form.Group>
                <Form.Group className="mb-2">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </Form.Group>
                <Button type="submit">Create account</Button>
            </Form>
        </Card>
    );
}