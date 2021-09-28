const express = require("express")
passport = require('passport')
const jwtRouter = express.Router();
const jwtService = require("../services/jwtService");


/**
 * @swagger
 * /jwt:
 *   post:
 *     summary: retrieve JWT for given username and password to use for api authentication
 *     description: retrieve JWT for given username and password to use for api authentication
 *     tags: [JWT]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               require: true
 *               description: username to authenticate to retrieve user jwt
 *               example: 'supervisor0'
 *             password:
 *               type: string
 *               require: true
 *               description: password for authentication to generate JWT
 *               example: 'password'
 *     responses:
 *       '200':
 *         description: JWT is created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               description: generated JWT
 *               example: eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdEZpcnN0TmFtZSB0ZXN0TGFzdE5hbWUiLCJlbWFpbCI6InRlc3RFbWFpbEB0ZXN0LmNvbSIsInBlcm1pc3Npb25zIjp7Ii91c2VycyI6eyJtZXRob2RzIjpbIkdFVCIsIlBPU1QiLCJQVVQiLCJERUxFVEUiXSwic2NvcGUiOlsiQUxMIl19LCIvdXNlcnMvOmlkIjp7Im1ldGhvZHMiOlsiR0VUIiwiUE9TVCIsIlBVVCIsIkRFTEVURSJdLCJzY29wZSI6WyJBTEwiXX19LCJ1c2VySUQiOiI2MTUxNGRlNjA3YjVhNDY0ZTA0MDZmOWQiLCJzdWIiOiI2MTUxNGRlNjA3YjVhNDY0ZTA0MDZmOWQiLCJ1c2VybmFtZSI6ImFkbWluMiIsImlhdCI6MTYzMjcxODMyNiwiZXhwIjoxNjMyNzQ4MzI2LCJpc3MiOiJkZW1vIn0.S6LkNybV9CLZG4jjJpmimT0EBqZ-F60nogvGnwYYviC9UwszKdhoQk1QG8Wr0E1VJyUv7T7YawuqVCQdu3qTaMBprshNI1u7poP0CecawC3RokOzbthU66sL5_iTOTjd9el44f1FXggyZqYzS3R1CqCLsk6Fe-bFiF71m6w4PeVGGpcxCqd0UvsSl4i1zxuZOE2KgF8or9R6ufFCzAZQv93pmopBqNjMau3-vAoek2U-TQzj_mqC_mAEa87T30zFoHXAEWHQRDqFo-wRNuPwCe7yGRwCah6GRPHsL4HtzZH_fqfidN_ZLeX7IMTDv18ty4ibCp-RCxi_TwyyixAqIQ
 *
 *       '400':
 *            description: Bad request. Username,
 *       '401':
 *            description: Unauthorized, please check if required token is provided
 *       '500':
 *            description: Internal Server Error
 */

jwtRouter.post("/", function (req, res, next) {
    jwtService.generateUserJWT(req.body.username).then((userJWT) => {
        return res.status(200).send(userJWT)
    })
})

module.exports = jwtRouter
