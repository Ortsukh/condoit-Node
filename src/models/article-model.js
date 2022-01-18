const {Schema, model, plugin} = require('mongoose');

const slug = require("mongoose-slug-generator");

plugin(slug);
const ArticleSchema = new Schema({
    
    description:{type: String, required: true},
    title: {type: String, required:true},

    author: {type: Object, required: true},
    createdAt: {type: String, required: true},
    favoritesCount: {type: Number, default : 0},
    tagList: {type: Array},
    favorited: {type: Boolean, required: false},
    body:{type: String, required: true},
    slug:{type: String, slug: "title", unique: true},
    favoritedUser:{type: Array}
})
// ArticleSchema.pre("save", function(next) {
//  console.log(this.slug); 
//  console.log(this.title);
//     this.slug = this.title.split(" ").join("-");
//     next();
//   });
  
module.exports = model('Article', ArticleSchema);   