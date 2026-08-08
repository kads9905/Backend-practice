import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema (
    {
        // mongodb allows to store these small images and video fiiles
        // directly as media files but not gud practice - load on db
        // so in professional code it is kept separately
        videoFile: {
            type: String, //cloudinary url 
            required: true
        },
        thumbnail: {
            type: String, 
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        duration: {
            type: Number, //cloudinary url - send time of videos duration
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

videoSchema.plugin(mongooseAggregatePaginate);

export const  Video = mongoose.model("Video", videoSchema); 