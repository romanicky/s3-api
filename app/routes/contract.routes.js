const { authJwt } = require("../middlewares")
const controller = require("../controllers/contract.controller")

module.exports = function (app) {
    app.use(function (reg, res, next) {
        res.header(
            "Access-Control-Alow-Headers",
            "authorization, Origin, Content-Type, Accept"
        )
        next()
    })

    /**
   * @swagger
   * /contracts:
   *    post:
   *      tags:
   *        - Contracts
   *      summary: Add a new contract
   *      requestBody:
   *        required: true
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                trainerId:
   *                   type: string
   *                clientId:
   *                  type: string
   *                total:
   *                  type: number            
   *                createdDate:
   *                  type: string
   *                expiredDate:
   *                  type: string
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back contractId.
   */
    app.post(
        "/contracts",
        [
            authJwt.verifyToken,
            // authJwt.isAdmin,

        ],
        controller.addContract
    )
    /**
   * @swagger
   * /contracts:
   *    get:
   *      tags:
   *        - Contracts
   *      summary: Get all contracts
   *      security:
   *        - JWT: []
   *      responses:
   *        200:
   *          description: Receive back a contract list.
   */
    app.get(
        "/contracts",
        [
            authJwt.verifyToken,
        ],
        controller.getAll
    )

    /**
     * @swagger
     * /contracts/{id}:
     *    get:
     *      tags:
     *        - Contracts
     *      summary: Get contracts by id
     *      parameters:
     *        - name: id
     *          in: path
     *          required: true
     *          type: string
     *      security:
     *        - JWT: []
     *      responses:
     *        200:
     *          description: Receive back contractId.
     */
    // app.get("/contracts/:id", [
    //     authJwt.verifyToken,
    // ], controller.getContract)

    /**
     * @swagger
     * /contracts/{id}:
     *    delete:
     *      tags:
     *        - Contracts
     *      summary: Delete a contracts by id
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
     *          description: Contract not found.
     */
    // app.delete(
    //     "/users/:id",
    //     [authJwt.verifyToken, authJwt.isAdmin],
    //     controller.deleteContract
    // )

}