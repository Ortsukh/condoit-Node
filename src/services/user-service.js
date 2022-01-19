const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const TokenModel = require("../models/token-model");
const ArticleModel = require("../models/article-model");
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async registration(email, password, name) {
        const candidate = await UserModel.findOne({
            email
        })
        const condidateName = await UserModel.findOne({
            name
        })
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`)
        }
        if (condidateName) {
            throw ApiError.BadRequest(`Пользователь с именем ${name} уже существует`)
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({
            email,
            password: hashPassword,
            activationLink,
            name
        })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user); // id, email, isActivated, name
        const tokens = tokenService.generateTokens({
            ...userDto
        });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({
            activationLink
        })
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await UserModel.findOne({
            email
        })
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({
            ...userDto
        });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({
            ...userDto
        });

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        }
    }

    async updateSetting(bio, image, password, username, refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const condidateName = await UserModel.findOne({
            name: username
        })

        const userData = await TokenModel.findOne({
            refreshToken
        })
        const userId = userData.user.toString();
        const user = await UserModel.findOne({
            _id: userId
        })
        // console.log(condidateName.name !== user.name);
        if (condidateName && condidateName.name !== user.name) {
            throw ApiError.BadRequest(`Пользователь с именем ${username} уже существует`)
        }
        
        if (password == '') {password = user.password;
        }else {password = await bcrypt.hash(password, 3)};
        
        
        await UserModel.updateOne({
            _id: userId
        }, {
            bio: bio,
            image: image,
            password: password,
            name: username,
        })
        await ArticleModel.updateMany({
            "author.username": user.name
        }, {
            "author.username": username,
            "author.bio": bio,
            "author.image": image,
        })
        const newUser = await UserModel.findOne({
            _id: userId
        })
        return {
            user: newUser
        }
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }
}

module.exports = new UserService();