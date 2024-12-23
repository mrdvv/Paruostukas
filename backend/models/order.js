import mongoose from "mongoose";
const {Schema} = mongoose;

const orderSchema = new Schema({
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
    totalPrice: {type: Number, default: 0},
    shippingAddress: { type: Schema.Types.ObjectId, ref: 'ShippingAddress', required: true },
}, {timestamps: true});

export default mongoose.model("Order", orderSchema);