const mongoose = require('mongoose');
const { Schema } = mongoose;

// Add your models here.
const purchaseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
  film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true, },
  quantity: { type: Number, required: true, default: 1, },
  total_price: { type: Number, required: true, },
  purchased_at: { type: Date, default: Date.now, ß},
});

const Purchase = mongoose.model('Purchase', purchaseSchema)

module.exports = Purchase