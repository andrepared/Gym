const mongoose = require('mongoose'); // Need to require mongoose in our models route.
const Review = require('./review');
const { gymLocationSchema } = require('../schemas');
const { options } = require('joi');
const Schema = mongoose.Schema; // Creating our Schema, short cut method, since we're going to use this in our callbacks, quite a few times. 

const ImageSchema = new Schema({ 
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
})
const GymLocationSchema = new Schema({  // Creating our Schema.
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: false
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'

        }
    ]
});
// Query Middleware
GymLocationSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
} )

module.exports = mongoose.model('Gym', GymLocationSchema); // modules are self-contained units of functionality that can be shared and reused across projects. They make our lives as developers easier, as we can use them to augment our applications with functionality that we haven’t had to write ourselves. They also allow us to organize and decouple our code, leading to applications that are easier to understand, debug and maintain.