import mongoose from "mongoose";
import * as SchemaTypes from "../types/SchemaTypes";

const ArticleSchema = new mongoose.Schema<SchemaTypes.IArticle>({
    title: {type: String, required: true},
    description: {type: String, required: true},
    publishedDate: {type: Date, required: true, default: Date.now()},
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user'}
})

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;