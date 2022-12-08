const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateGymLocation }  = require('../middleware'); 
const GymLocation = require('../models/gymlocations'); // Need to require the models route, so we could find it in the MongooseDb. Recieve an error if not included in line 23. 
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const gymlocations = require('../controllers/gymlocations');

router.route('/')
    .get(catchAsync(gymlocations.index))// Use .get to create our index route
// Order matters, when using creating a form. If /new is placed under the :id, it'll look for an id named 'new'.
    .post(isLoggedIn, upload.array('image'), validateGymLocation, catchAsync(gymlocations.createGymlocation))
   

router.get('/new', isLoggedIn, gymlocations.renderNewForm);

router.route('/:id')
.get(catchAsync(gymlocations.showGymlocation))
// Creating our show/id route.. this is our show page or details page.
// We need this id to look up the corresponding gymlocation in our database. Should be an async route handler. Then we could implement the find.
.put(isLoggedIn, isAuthor, upload.array('image'), validateGymLocation, catchAsync(gymlocations.updateGymlocation))
.delete(isLoggedIn, isAuthor, catchAsync(gymlocations.destroyGymlocation))
// Last step in implementing full CRUD, adding a delete button. Now we just need to send a POST req to this URL, but its going to fake out req b/c of method-override.
// We'll need a route that servers the form. 
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(gymlocations.renderEditForm));


module.exports = router;