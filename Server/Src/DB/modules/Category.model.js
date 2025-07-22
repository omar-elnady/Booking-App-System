import { Schema, Types, model } from 'mongoose'

const categorySchema = new Schema({
    name: {
        en: { type: String, required: true, unique: true },
        ar: { type: String, required: true, unique: true }
    }
}, { timestamps: true })
const categoryModel = model('category', categorySchema)
export default categoryModel