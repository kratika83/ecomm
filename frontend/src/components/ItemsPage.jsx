// frontend/src/components/ItemsPage.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { API } from '../api';
import { Row, Col, Form, Button } from 'react-bootstrap';
import ItemCard from './ItemCard';
import { AuthContext } from '../contexts/AuthContext';

export default function ItemsPage() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState('');
    const [q, setQ] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [sort, setSort] = useState('');
    const { addToCart } = useContext(AuthContext);

    const fetchItems = async () => {
        const params = {};
        if (category) params.category = category;
        if (q) params.q = q;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (sort) params.sort = sort;
        const res = await axios.get(`${API}/api/items`, { params });
        setItems(res.data);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleFilter = async (e) => {
        e?.preventDefault();
        fetchItems();
    };

    return (
        <>
            <Form className="mb-3" onSubmit={handleFilter}>
                <Row className="g-2 align-items-end">
                    <Col md>
                        <Form.Control
                            placeholder="Search"
                            value={q}
                            onChange={e => setQ(e.target.value)}
                        />
                    </Col>
                    <Col md>
                        <Form.Control
                            placeholder="Category"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                        />
                    </Col>
                    <Col md>
                        <Form.Control
                            placeholder="Min price"
                            type="number"
                            value={minPrice}
                            onChange={e => setMinPrice(e.target.value)}
                        />
                    </Col>
                    <Col md>
                        <Form.Control
                            placeholder="Max price"
                            type="number"
                            value={maxPrice}
                            onChange={e => setMaxPrice(e.target.value)}
                        />
                    </Col>
                    <Col md>
                        <Form.Select value={sort} onChange={e => setSort(e.target.value)}>
                            <option value="">Sort</option>
                            <option value="price_asc">Price: low → high</option>
                            <option value="price_desc">Price: high → low</option>
                        </Form.Select>
                    </Col>
                    <Col md="auto">
                        <Button type="submit">Apply</Button>
                    </Col>
                </Row>
            </Form>

            <Row>
                {items.map(it => (
                    <Col key={it._id} sm={6} md={4} lg={3} className="mb-3">
                        <ItemCard item={it} onAdd={() => addToCart(it._id, 1)} />
                    </Col>
                ))}
            </Row>
        </>
    );
}