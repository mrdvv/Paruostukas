import mongoose from 'mongoose';
const {Schema} = mongoose;

const productSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
}, {timestamps: true});

export default mongoose.model('Product', productSchema);