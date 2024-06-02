import { Schema, models, model, Document } from 'mongoose';

export interface ITestimonial extends Document {
  review_text: string;
  review_star: number;
  desc: string;
  name: string;
  location: string;
  image: {
    url: string;
    public_id?: string;
  }; // Path to image as a string
}

const testimonialSchema = new Schema({
  review_text: { type: String, required: true },
  review_star: { type: Number, required: true },
  desc: { type: String, required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    public_id: { type: String }
  }
});

const Testimonial =
  models.Testimonial || model('Testimonial', testimonialSchema);

export default Testimonial;
