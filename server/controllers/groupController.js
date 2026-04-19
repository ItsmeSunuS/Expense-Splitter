const Group = require("../models/Group")

exports.createGroup = async (req, res) => {

try {

const group = new Group(req.body)

await group.save()

res.json(group)

} catch (error) {

res.status(500).json(error)
}

}

exports.getGroups = async (req, res) => {

const groups = await Group.find()

res.json(groups)

}