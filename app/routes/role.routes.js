const { authJwt } = require("../middlewares")
const controller = require("../controllers/role.controller")

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "authorization, Origin, Content-Type, Accept"
    )
    next()
  })

  app.get("/roles", [authJwt.verifyToken], controller.all)
}
