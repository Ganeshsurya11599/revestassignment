const Bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

let client = require('../database/databasepg');

var login = async function (req, res, next) {
    let sqlQuery = `select user_id,email,password_hash,role,username from users where email = '${req.body.email}' and is_active = true`
    let result = await client.query(sqlQuery, []);
    client.end();
    var getUser = result.rows;
    if (getUser && getUser.length > 0) {
        let validPassword = await Bcrypt.compare(req.body.password, getUser[0].password_hash);
        console.log(validPassword, 'password')
        if (validPassword) {
            let jwtToken = jwt.sign({
                username: getUser[0].email,
                userId: getUser[0].user_id
            }, "longer-secret-is-better", {
                expiresIn: "2h"
            });
            res.status(200).json({
                status: true,
                role: getUser[0].role,
                username: getUser[0].username,
                token: jwtToken,
                expiresIn: 3600
            });
        }
        else {
            res.send({ status: false, msg: 'Invalid password!..' })
        }
    }
    else {
        res.send({ status: false, msg: 'Invalid user or Inactive user!..' })
    }
}

var getUsers = async function (req, res) {
    let token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token, 'longer-secret-is-better');
        let sqlQuery = `select user_id,email,password_hash,role,username,is_active from users where createdby = '${decoded.userId}'`;
        let result = await client.query(sqlQuery, []);
        let getAllUsers = result.rows;
        if (getAllUsers && getAllUsers.length > 0) {
            res.send({ status: true, msg: 'Data Fetched!..', data: getAllUsers });
        }
        else {
            res.send({ status: false, msg: 'Data Not Found!..' })
        }
    }
    catch (error) {
        console.log(error)
        res.send({ status: false, msg: 'Token Expired!..' })
    }
};

var createUser = async function (req, res) {
    let input = req.body;
    let token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token, 'longer-secret-is-better');
        const saltRounds = 10; // Number of salt rounds (cost factor)
        const hashedPassword = await Bcrypt.hash(input.password, saltRounds);
        let sqlQuery = `INSERT INTO users (username, email, password_hash,role,createdby) VALUES ('${input.username}', '${input.email}', '${hashedPassword}','${input.role}','${decoded.userId}');`
        let result = await client.query(sqlQuery, []);
        if (result) {
            res.send({ status: true, msg: 'User Created Successfully!..' });
        }
        else {
            res.send({ status: false, msg: 'User Not Created!..' })
        }
    }
    catch (error) {
        res.send({ status: false, msg: 'Token Expired!..' })
    }
};

var activeStatus = async function (req, res) {
    let token = req.headers.authorization;
    try {
        var decoded = jwt.verify(token, 'longer-secret-is-better');
        console.log('Decoded JWT:', decoded);
        let sqlQuery = `update users set is_active = '${req.body.isactive}' where createdby = '${decoded.userId}'`;
        let result = await client.query(sqlQuery, []);
        if (result) {
            res.send({ status: true, msg: 'User Active status changed successfully!..' });
        }
        else {
            res.send({ status: false, msg: 'User Active status not changed!..' });
        }
    }
    catch (error) {
        res.send({ status: false, msg: 'Token Expired!..' })
    }
};


module.exports = {
    login: login,
    getUsers: getUsers,
    createUser: createUser,
    activeStatus: activeStatus,

}