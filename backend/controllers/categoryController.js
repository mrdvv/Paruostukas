import Category from "../models/category.js";

export const createCategory = async(req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({success: false, message:"Category name is required"})
        }

        const category = new Category({name});
        await category.save();
        
        res.status(201).json({success: true, data: category });
    } catch (error) {
        console.error("Error creating category:", error.message);
        res.status(500).json({ success: false, message: "Server error"});
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        if (!categories.length) {
            return res.status(404).json({success: false, message:"No categories found."})
        }
        res.status(200).json({ success: true, data: categories});        
    } catch (error) {
        console.error("Error getting Categories:", error.message)
        res.status(500).json({ success: false, message: "Server Error"});
    }
}