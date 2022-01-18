module.exports = class UserDto {
    email;
    id;
    isActivated;
    name;
    bio;
    image;
    constructor(model) {
        this.email = model.email;
        this.id = model._id;
        this.isActivated = model.isActivated;
        this.name = model.name;
        this.bio = model.bio;
        this.image = model.image;

    }
}