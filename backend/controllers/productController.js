import Product from '../models/product'

export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body)
        await newProduct.save()
        res.status(201).json({success: true, data: newProduct})
    } catch (error) {
        res.status(400).json({success: false, message: error.message })
    }
}

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
        const products = await Product.find()
        if (products.length === 0) {
            return res.status(200).json({success: false, message: 'Products not found', data: []})
        }
        res.json({success: true, data: products})
    } catch (error) {
        res.status(400).json({success: false, message: error.message })
    }
}
