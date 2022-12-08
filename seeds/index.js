// This file is going to be self-contained. It's going to connect to mongoose and use my model. 
// We will run this file on its own, seperate from the Node file, anytime we want to seed our Database. So, just anytime we make changes to our Model or to our Data; it's not often at all. 
const mongoose = require('mongoose'); // Need to require mongoose.
const cities = require('./cities')  // Have to import this array. 
const {places, descriptors} = require('./nameHelpers') // Need to import the nameHelper.js file. 
const GymLocation = require('../models/gymlocations') // Need to require the models route, so we could find it in the MongooseDb. Recieve an error if not included in line 23. 
// const axios = require('axios');


mongoose.connect('mongodb://localhost:27017/saca-gym').
    catch(error => handleError(error))
console.log('Database Connected.'); // Ripped this handling error code off the Mongoose website. Also, added a console.log to print out that the db is connected.
// Ripped this code [line 2 - 10] of the app.js file, to connect to Mongoose. Don't need path or express. 
const sample = array => array [Math.floor(Math.random() * array.length)]; // Created this function as its own. Basically going to use this in two places. Pass in the array and return a random element from that array. 

//  // call unsplash and return small image
// async function seedImg() {
//     try {
//         const resp = await axios.get('https://api.unsplash.com/photos/',
//             {

//             params: {
//                 client_id: 'cPj-Ul0taiTUiB37nhIpSDFYXWrCqPMrN-OgH6XVXBI',
//                     collections: 1114848,
//             },
//         })
//         return resp.data.urls.small
//     } catch (err) {
//         console.error(err)
//     }
// }

    // 
    //
    const seedDb = async () => {
        await GymLocation.deleteMany({})

        for (let i = 0; i < 25; i++) {  // Want to loop 50 times. Going to use a random number to pick a city, from cities file that contain 1000 cities. 
            const random1000 = Math.floor(Math.random() * 1000); 
            const price = Math.floor(Math.random() * 50) + 10;
            // seed data into gymlocation
            const gym_1 = new GymLocation({
                // YOUR
                author: '635178b9d968005c2b08d3f6',
                location: `${cities[random1000].city}, ${cities[random1000].state}`,
                title: `${sample(descriptors)} ${sample(places)}`, // Want to generate a random name.
                 // Want to generate a random image // Not working, with the new cookie update. 
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Et accusantium illo necessitatibus aliquam voluptatibus, deserunt voluptatem pariatur architecto recusandae porro temporibus aperiam iste ducimus praesentium nostrum facilis enim, repudiandae dignissimos.',
                price,
                geometry: {
                    type: 'Point',
                    coordinates: [
                        cities[random1000].longitude,
                        cities[random1000].latitude,
                    ]
                },
                images: [
                    {
                    url: 'https://res.cloudinary.com/doxd8y17p/image/upload/v1666827246/SacaGym/wtmca2pfneyqsahmuh1b.jpg',
                    filename: 'SacaGym/wtmca2pfneyqsahmuh1b',
                    },
                    {
                    url: 'https://res.cloudinary.com/doxd8y17p/image/upload/v1666827246/SacaGym/o14ajlrsqmgydqsb1mo6.jpg',
                    filename: 'SacaGym/o14ajlrsqmgydqsb1mo6',
                    },
                    {
                    url: 'https://res.cloudinary.com/doxd8y17p/image/upload/v1666827247/SacaGym/tprycqw1bqgozhyqggfz.jpg',
                    filename: 'SacaGym/tprycqw1bqgozhyqggfz',
                    }
                ]
            })
            await gym_1.save(); // Calling the .save() method. 
        }
    };

seedDb().then(() => {
        mongoose.connection.close();
    });
