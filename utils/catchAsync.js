// Wrap our Async Functions
// Func is what you pass in, this returns a new function that has func executed and then catches any errors and passes them to next. 
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}