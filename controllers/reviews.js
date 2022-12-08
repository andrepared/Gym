const GymLocation = require('../models/gymlocations');
const Review = require('../models/review');


module.exports.createReview = async (req, res, next) => {
    const gymlocation = await GymLocation.findById(req.params.id);
    const review = new Review(req.body.review)// Make new review.
    review.author = req.user._id;
    gymlocation.reviews.push(review);
    await review.save();
    await gymlocation.save();
    req.flash('success', 'Created new review!!')
    res.redirect(`/gymlocations/${gymlocation._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await GymLocation.findByIdAndUpdate(id, {$pull: { reviews: reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/gymlocations/${id}`) // Redirect us back to the gymlocation page. 
}