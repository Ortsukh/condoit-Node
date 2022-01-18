const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name:{type:String, unique:true, required: true},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    bio:{type:String, default:null},
    following:{type:Array, default:[]},
    image:{type:String, default: "https://api.realworld.io/images/demo-avatar.png"}
})

module.exports = model('User', UserSchema);