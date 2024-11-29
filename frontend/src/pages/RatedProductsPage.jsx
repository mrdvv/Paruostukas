import React, {useEffect, useState } from 'react';
import {Box, Typography, Grid2, Card, Grid, CardMedia, CardContent} from '@mui/material';
import axios from 'axios';

const RatedProductsPage = () => {
    const [ratedProducts, setRatedProducts] = useState([]);
    const [loading, setLoading] = useState(false);

useEffect(() => {
    const fetchRatedProducts = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/products/rated', {
                headers: {Authorization: `Bearer ${localStorage.getItem('token')}`}
            });
            setRatedProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching Rated Products: ', error);
        } finally {
            setLoading(false);
        }
    };

    fetchRatedProducts();
}, []);

if(loading) {
    return <Typography>Loading your rated ad's</Typography>
}

return (
    <Box sx={{mt:4}}>
        <Typography variant="h4" gutterBottom>
            Your Rated Ads
        </Typography>
    <Grid2 container spacing={2}>
        {ratedProducts.length > 0 ? (
            ratedProducts.map((product) => (
                <Grid2 item xs={12} sm={6} md={4} key={product._id}>
                <Card>
                <CardMedia
          component="img"
          height="140"
          image={product.image || 'https://via.placeholder.com/150'}
          alt={product.name}
        />
                    <CardContent>
                        <Typography variant="h6">{product.name}</Typography>
                        <Typography variant="body2">Rating: {product.rating}</Typography>
                        <Typography variant="body2">Price: €{product.price}</Typography>
                    </CardContent>
                </Card>
                </Grid2>
            )) 
        ) : (
            <Typography>No rated ads Found.</Typography>
        )}
    </Grid2>
    </Box>
);
};

export default RatedProductsPage;