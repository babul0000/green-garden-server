import mongoose, { Schema, Model } from 'mongoose';
import { ISetting } from '../types/index.js';

const SettingSchema = new Schema<ISetting>({
  key: { type: String, required: true, unique: true, default: 'site_config' },
  value: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });

const Setting: Model<ISetting> = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
export default Setting;
