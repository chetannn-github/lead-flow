import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: Date, default: Date.now },
  followUpDate: { type: Date, default: null }
});

const leadSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: [true, 'Full name is required'],
    trim: true 
  },
  company: { 
    type: String, 
    trim: true,
    default: ''
  },
  phone: { 
    type: String, 
    trim: true,
    default: ''
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'], 
    default: 'New' 
  },
  notes: [noteSchema],
  nextFollowUp: { 
    type: Date,
    default: null
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    index: true
  }
}, { 
  timestamps: true
});

leadSchema.index({ fullName: 'text', company: 'text' });//

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;