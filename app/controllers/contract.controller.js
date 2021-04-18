const db = require("../models")
const bcrypt = require("bcryptjs")

const Contract = db.contract
const Role = db.role
const User = db.user

exports.addContract = (req, res) => {
    const contract = new Contract({
        trainerId: req.body.trainerId,
        clientId: req.body.clientId,
        total: req.body.total,
        createdDate: req.body.createdDate,
        expiredDate: req.body.expiredDate

    })

    User.findOne({ _id: req.body.trainerId }, (err, trainer) => {
        if (!trainer) {
            res.status(404).send({ message: 'Trainer not found' })
            return
        }

        if (err) {
            res.status(500).send({ message: err })
            return
        }

        User.findOne({ _id: req.body.clientId }, (err, client) => {
            if (!client) {
                res.status(404).send({ message: 'Client not found' })
                return
            }

            if (err) {
                res.status(500).send({ message: err })
                return
            }

            contract.save((err, contract) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }
                res.status(200).send(contract._id)

            })
        })

    })
}
exports.getAll = (req, res) => {
    Contract.find({}, "fullname username email roles", (err, contract) => {
      if (err) {
        res.status(500).send({ message: err })
        return
      }
      res.send({ contract: contract, total: contract.length })
    })
  }