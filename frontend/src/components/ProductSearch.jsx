import React, {useState, useEffect} from 'react';
import {Box, TextField, Select, MenuItem, Button} from '@mui/material';
import useStore from '../store/store.js'

const ProductSearch = () => {
    const { list, fetchFilteredProducts} = useStore((state) => state.products);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/categories');
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error.message);
            }
        };
    fetchCategories();
    }, []);
    const handleSearch = () => {
        fetchFilteredProducts(search, category);
    }
    
    return (
        <Box display="flex" flexDirection="column" gap={2} sx={{mt:4}}>
            <TextField label="Search by Name" value={search} onChange={(e) => setSearch(e.target.value)} fullWidth />
            <Select value={category} onChange={(e) => setCategory(e.target.value)} displayEmpty fullWidth>
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem key={category._id} value={category._id}>
                {category.name}
                </MenuItem>
            </Select>
        <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
        </Button>
        <Box> {list.map((product) => (
        <Box key={product._id} sx={{mt:2, border: '1 px solid #ccc', p: 2}}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Category: {product.category?.name || 'N/A'}</p>
            <p>PRice: ${product.price}</p>
            </Box>
        ))}
        </Box>
     </Box>
    )
}

export default ProductSearch