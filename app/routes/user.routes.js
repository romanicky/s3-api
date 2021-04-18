const { authJwt, verifySignUp } = require("../middlewares")
const controller = require("../controllers/user.controller")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get("/test/all", controller.allAccess)

  app.get("/test/user", [authJwt.verifyToken], controller.userBoard)

  app.get(
    "/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  )

  app.get(
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  )

  /**
   * @swagger
   * /users:
   *    post:
   *      tags:
   *        - Users
   *      summary: Add a new user
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                email:
   *                  type: string
   *                fullname:
   *                  type: string
   *                password:
   *                  type: string
   *                username:
   *                  type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back userId.
   */
  app.post(
    "/users",
    [
      authJwt.verifyToken,
      authJwt.isAdmin,
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.addUser
  )

  /**
   * @swagger
   * /users:
   *    get:
   *      tags:
   *        - Users
   *      summary: Get all users
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a user list.
   */
  app.get(
    "/users",
    [
      authJwt.verifyToken,
      authJwt.isAdmin
    ],
    controller.getAll
  )

  /**
   * @swagger
   * /users/{id}:
   *    get:
   *      tags:
   *        - Users
   *      summary: Get user by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back userId.
   */
  app.get("/users/:id", [
    authJwt.verifyToken,
  ], controller.getUser)

  /**
   * @swagger
   * /users/{id}:
   *    delete:
   *      tags:
   *        - Users
   *      summary: Delete a user by id
   *      parameters:
   *        - name: id
   *          in: path
   *          required: true
   *          type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        400:
   *          description: Invalid Id.
   *        404:
   *          description: User not found.
   */
  app.delete(
    "/users/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  )
}
