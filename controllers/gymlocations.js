const GymLocation = require('../models/gymlocations'); 
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
module.exports.index = async (req, res) => {
    const gymlocations = await GymLocation.find({}); // Find everything. 
    res.render('gymlocations/index', { gymlocations }); // I grabbed the gym locations but need to render them!!
}
module.exports.renderNewForm = (req, res) => {    // Don't need an async fx. We're just going to render a form. 

    res.render('gymlocations/new'); 
}
module.exports.createGymlocation = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gymlocations.location,
        limit: 1
    }).send()
    const gymlocation = new GymLocation(req.body.gymlocations);
    gymlocation.geometry = geoData.body.features[0].geometry;
    gymlocation.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gymlocation.author = req.user._id;
    await gymlocation.save();
    console.log(gymlocation);
    req.flash('success', 'Successfully made a new gym!');
    res.redirect(`/gymlocations/${gymlocation._id}`)
}
module.exports.showGymlocation = async (req, res) => {   
const gymlocation = await GymLocation.findById(req.params.id).populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
    }).populate('author');// Nesting populate
    if (!gymlocation) {
        req.flash('error', 'Can not find that Gym!')
        return res.redirect('/gymlocations')
    }
    res.render('gymlocations/show', {gymlocation}); // We'll soon talk about, error handling, assuming we can't find by id. But for now we'll assume the best possible scenario.
}
module.exports.renderEditForm = async (req, res) => { // need to look up the thing we're editing and prepopulate the form with the information. 
    const { id } = req.params;
    const gymlocation = await GymLocation.findById(req.params.id); 
      if (!gymlocation) {
        req.flash('error', 'Can not find that Gym!')
        return res.redirect('/gymlocations')
      }
      res.render('gymlocations/edit', {gymlocation})
}
module.exports.updateGymlocation = async (req, res) => { // Need to update the gym we want to update. So we need the req.body.gymlocations, so that should be the new information for that gym location. 
    const { id } = req.params; // Destructured id. 
    console.log(req.body);
    const gymlocation = await GymLocation.findByIdAndUpdate(id, { ...req.body.gymlocations });// use the spread operator.
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gymlocation.images.push(...imgs); await gymlocation.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gymlocation.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(gymlocation)
    }
    req.flash('success', 'Successfully updated gym!');
    res.redirect(`/gymlocations/${gymlocation._id}`)
}
module.exports.destroyGymlocation = async (req, res) => {
    const { id } = req.params;
     const gymlocation = await GymLocation.findById(id)
    if (!gymlocation.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/gymlocations/${id}`);
    }
    await GymLocation.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted gym!')
    res.redirect('/gymlocations');
}