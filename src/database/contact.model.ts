import { Schema, models, model, Document } from 'mongoose';

// Mongoose schema
export interface ContactMessages extends Document {
  name: string;
  email: string;
  subject?: string;
  message: string;
  sentAt?: Date;
  isReply?: boolean;
}

const ContactFormSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  subject: String,
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  isReply: { type: Boolean },
  sentAt: { type: Date, default: Date.now }
});

const Contact = models.Contact || model('Contact', ContactFormSchema);

export default Contact;
