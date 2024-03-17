import { Schema, model, models, Document } from 'mongoose';

export interface IShareData extends Document {
  employeeId: Schema.Types.ObjectId | string;
  candidates: string[];
  shareAt: Date;
}

const shareDataSchema = new Schema<IShareData>({
  employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  candidates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  shareAt: {
    type: Date,
    default: Date.now
  }
});

const ShareData = models.ShareData || model('ShareData', shareDataSchema);

export default ShareData;
