import { Schema, models, model, Document } from 'mongoose';

// Mongoose schema for email subscriptions
export interface IEmailSubscription extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string; // Where the subscription came from (newsletter, footer, etc.)
}

const EmailSubscriptionSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'newsletter'
  }
});

const EmailSubscription = models.EmailSubscription || model('EmailSubscription', EmailSubscriptionSchema);

export default EmailSubscription;