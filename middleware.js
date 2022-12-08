const { gymLocationSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError')
const GymLocation = require('./models/gymlocations');
const { reviewSchema } = require('./schemas.js'); // Joi Schema 
const Review = require('./models/review'); 

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateGymLocation = (req, res, next) => {
    const { error } = gymLocationSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        console.log(error)
        throw new ExpressError(msg, 400)
        
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const gymlocation = await GymLocation.findById(id)
    if (!gymlocation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/gymlocations/${gymlocation._id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
      if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/gymlocations/${id}`);
    }
    next();
}