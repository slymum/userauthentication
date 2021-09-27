


const express = require("express")
passport = require('passport')
const userRouter = express.Router();
const userService = require("../services/userService");
const securityUtils = require("../utilities/securityUtils");
/**
 * @swagger
 * components:
 *   schemas:
 *     user:
 *      type: object
 *      properties:
 *        username:
 *           type: string
 *           require: true
 *           description: username to login to get jwt, along with password, can't be changed
 *           example: 'testusername'
 *        password:
 *           type: string
 *           require: true
 *           description: password for authentication to generate JWT
 *           example: 'p@SsW0r$'
 *        firstName:
 *           type: string
 *           require: true
 *           description: The user's first name.
 *           example: 'testFirstName'
 *        lastName:
 *           type: string
 *           require: true
 *           description: The user's last name.
 *           example: 'testLastName'
 *        email:
 *           type: string
 *           require: true
 *           description: The user's email.
 *           example: 'testEmail@test.com'
 *        supervisor:
 *           type: string
 *           description: The user's manager.
 *           example: '61511be61b6eb078da4e2265'
 *        roles:
 *           type: array
 *           items:
 *              type: string
 *              description: The user's role can be EMP, MANAGER, ADMIN, default EMP
 *              enum: [EMP,SUPERVISOR,ADMIN]
 *              example: 'ADMIN'
 */




/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a user
 *     description: Create a user into application, userID is unique and can be used for delete, update, get
 *     security:
 *        - bearerAuth: []
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       '201':
 *         description: user is created successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/user'
 *
 *       '400':
 *            description: Bad request. Username,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */
userRouter.post("/", securityUtils.isAuthorized, function (req, res, next) {
    userService.createUser(req, res)
});



/**
 * @swagger
 * /users:
 *   get:
 *     summary: get  list of user, based on the token will determine list of user to be return
 *     description: get  list of user, based on the token will determine list of user to be return
 *     security:
 *        - bearerAuth: []
 *     tags: [Users]
 *     responses:
 *       '200':
 *         description: user is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                type: array
 *                items:
 *                  $ref: '#/components/schemas/user'
 *
 *       '400':
 *            description: Bad request. Username,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */

userRouter.get("/", securityUtils.isAuthorized, function (req, res, next) {
    userService.getAllUser(req, res)
});


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: get a user
 *     description: get a user
 *     security:
 *        - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: id of the user to get
 *     responses:
 *       '200':
 *         description: user is retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/user'
 *
 *       '400':
 *            description: Bad request. Username,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */
userRouter.get("/:id", securityUtils.isAuthorized, function (req, res, next) {
    userService.getUser(req, res)
});


/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: delete a user by id
 *     description: delete a user by id
 *     security:
 *        - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: id of the user to delete
 *     responses:
 *       '204':
 *         description: user is deleted successfully, No Content
 *       '400':
 *            description: Bad request.,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */
userRouter.delete("/:id", securityUtils.isAuthorized, function (req, res, next) {
    userService.deleteUser(req, res)
});


/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: update a user by id
 *     description: update a user by id
 *     security:
 *        - bearerAuth: []
 *     tags: [Users]
 *     parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: id of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       '200':
 *         description: user is update successfully
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/user'
 *       '400':
 *            description: Bad request.,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */

userRouter.put("/:id", securityUtils.isAuthorized, function (req, res, next) {
    userService.updateUser(req, res)
});


module.exports = userRouter;
