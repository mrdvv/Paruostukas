import Product from '../models/product.js'
import mongoose from 'mongoose';
export const createProduct = async (req, res) => {
    try {
      const { name, price, image, description, category } = req.body;
      if (!mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
      
      if (!name || !price || !image || !description || !category) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
  
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, message: 'Category not found' });
      }
      console.log('Category exists:', categoryExists);
      const product = new Product({ name, price, image, description, category });
      await product.save();
  
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      console.error('Error creating product:', error.message);
      res.status(400).json({ success: false, message: error.message });
    }
  };
  
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id)
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found' })
        }
        res.json({success: true, data: product})
    }
    catch (error) {
        res.status(400).json({success: false, message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({success: false, message: 'Product not found' })
        }
        res.json({success: true, data: product})
    } catch (error) {
        res.status(400).json({success: false, message: error.message })
    }
}

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        if (products.length === 0) {
            return res.status(200).json({success: false, message: 'Products not found', data: []})
        }
        res.json({success: true, data: products})
    } catch (error) {
        res.status(400).json({success: false, message: error.message })
    }
}

export const toggleRating = async (req, res) => {
    const userID = req.user._id; 

    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        if (product.ratedBy.includes(userID)) {
       
            product.rating = Math.max(product.rating - 1, 0); 
            product.ratedBy = product.ratedBy.filter((id) => id.toString() !== userID.toString());
        } else {
  
            product.rating += 1;
            product.ratedBy.push(userID);
        }

        await product.save();

        res.json({
            success: true,
            data: {
                rating: product.rating,
                ratedBy: product.ratedBy,
            },
        });
    } catch (error) {
        console.error('Error toggling rating:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const GetRatedProducts = async (req, res) => {
    try {
    const userID = req.user._id;
    const ratedProducts = await Product.find({ ratedBy: userID });
    res.status(200).json({ success: true, data: ratedProducts });
    } catch (error) {
        console.error("Error getting rated Products:", error.message);
        res.status(500).json({ success: false, message: 'Server Error'});
    }
}

export const searchProducts = async (req , res) => {
    try {
        const {search, category } = req.query;
        const query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }
        const products = await Product.find(query).populate('category', 'name');

        res.status(200).json({ success: true, data: products });
    } catch (error) {
        console.error('Error searching products:', error.message);
        res.status(500).json({ success: false, message: 'Server error.'})
    }
};