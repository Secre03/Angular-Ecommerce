const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    barangay: { type: String, required: true },
    completeAddress: { type: String, required: true },
    zipCode: { type: String },
    isDefault: { type: Boolean, default: false },
    label: { type: String, enum: ['home', 'work', 'other'], default: 'home' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Address', AddressSchema);
