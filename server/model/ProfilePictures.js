import mongoose from 'mongoose';

const { Schema } =mongoose

const ProfilePictureSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    image: {
        type: Buffer,
        required: false,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    },
})

const ProfilePicture = mongoose.model('ProfilePicture', ProfilePictureSchema)

export default ProfilePicture