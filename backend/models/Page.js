import mongoose from "mongoose";

const PageSchema = new mongoose.Schema({
    pageName: {
        type: String,
        required: true
    },
    pageData: {
        type: String,
        required: true,
        default: ""
    },
    owner: {
        type: mongoose.types.ObjectId,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    }
});

export default new mongoose.model("Page", PageSchema);
