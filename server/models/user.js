const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;
const SALT_VAL = 10;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: Boolean,
    board_state: { type: Schema.Types.ObjectId, ref: 'Board' },
    creation_date: { type: Date, required: true },
    update_date: Date
});

userSchema.pre('save', function (next) {
    var user = this;

    bcrypt.genSalt(SALT_VAL, function (err, salt) {
        if (err) {
            console.log('error salting');
            return next(err);
        }

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) {
                console.log('error hashing');
                return next(err);
            }

            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};

userSchema.methods.generateJwt = function () {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.username,
        exp: parseInt(expiry.getTime() / 1000)
    }, JWT_TOKEN_SECRET);
}

module.exports = mongoose.model('User', userSchema);