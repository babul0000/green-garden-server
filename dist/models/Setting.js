import mongoose, { Schema } from 'mongoose';
const SettingSchema = new Schema({
    key: { type: String, required: true, unique: true, default: 'site_config' },
    value: { type: Schema.Types.Mixed, required: true }
}, { timestamps: true });
const Setting = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export default Setting;
