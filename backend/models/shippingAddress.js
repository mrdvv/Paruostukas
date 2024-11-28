import mongoose from 'mongoose';
const { Schema } = mongoose;

const shippingAddressSchema = new Schema({
  userID: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  street: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('ShippingAddress', shippingAddressSchema);
