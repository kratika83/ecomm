// frontend/src/components/NavBar.jsx
import React, { useContext } from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export default function NavBar() {
    const { user, cart, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/items');
    };

    const cartCount = (cart?.items || []).reduce((s, i) => s + (i.qty || 0), 0);

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/items">My E-Shop</Navbar.Brand>
                <Nav className="ms-auto">
                    <Nav.Link as={Link} to="/items">Products</Nav.Link>
                    <Nav.Link as={Link} to="/cart">
                        Cart {cartCount > 0 && <Badge bg="secondary">{cartCount}</Badge>}
                    </Nav.Link>
                    {user ? (
                        <>
                            <Nav.Link disabled>{user.name}</Nav.Link>
                            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}