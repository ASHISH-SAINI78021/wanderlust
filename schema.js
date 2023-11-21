const joi = require("joi"); // It is used for schema validation , see app.post
const listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        location : joi.string().required() ,
        country : joi.string().required() ,
        price : joi.number().required() ,// it may be number or string
        images : joi.string().allow("" , null)
    }).required() ,
}); 
module.exports = listingSchema;
// if i want to add a condition in joi
// isDiscount : joi.boolean().required(),
// price : joi.alternatives().when('isDisconted' , {
//             is : true ,
//             then : joi.number().required() ,
//             otherwise : joi.string().allow("" , null)
// })

module.exports.reviewSchema = joi.object({
   review : joi.object({
      rating : joi.number().required().min(1).max(5) ,
      comment : joi.string().required()
   }).required()
});