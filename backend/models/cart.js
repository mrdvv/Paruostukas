import mongoose from 'mongoose';
const {Schema} = mongoose

const cartSchema = new Schema({
    userID: {type: Schema.Types.ObjectId, ref: 'User', required: true, index:true},
    products: [
        {
            product: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {
                type: Number,
                required: true,
                default: 1,
            }
        }
    ],
    totalPrice: {type: Number, default: 0}
}, {timestamps: true});

export default mongoose.model('Cart', cartSchema);
