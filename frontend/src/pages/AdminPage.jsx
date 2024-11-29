import React, { useState, useEffect } from 'react';
import {Box, TextField, Button, Typography, List, ListItem} from '@mui/material';
import useStore from "../store/store.js";

const AdminPage = () => {
    const {list, fetchCategories, createCategory } = useStore((state) => state.categories);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleAddCategory = async () => {
        if (newCategory.trim() === "") return;
        await createCategory(newCategory);
        setNewCategory("");
    };

    return (
        <Box sx={{ mt:4, maxWidth: 600, mx: "auto"}}>
            <Typography variant="h4" gutterBottom> Manage Categories</Typography>
            <Box display="flex" gap={2} mb={4}>
                <TextField
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                label="New Category"
                fullWidth />
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
                Add Category
            </Button>
            </Box>
            <Typography variant="h6" gutterBottom>Categories</Typography>
            <List>
                {list.map((category) => (
                    <ListItem key={category._id}>{category.name}</ListItem>
                ))}
            </List>
        </Box>
    );
};

export default AdminPage;