const Project = require("../models/project")
const User = require("../models/user")
const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  // res.render("board/manageProject")
  User.find({ project: req.user.project })
    .then(users => {
      res.render("board/manageProject", {
        users
      })
    })
    .catch(err => {
      console.log(err)
    })
})

//join an existing team
router.put("/", (req, res) => {
  let project = req.body.project
  Project.findOne({ name: project.name }).then(projectExist => {
    if (!projectExist) console.log("Project doesn't exist")
    else
      User.findByIdAndUpdate(req.user.id, {
        project: project.name
      })
        .then(() => {
          res.redirect("/manageProject")
        })
        .catch(err => console.log(err))
  })
})

//create a team/project
router.post("/", (req, res) => {
  let formData = req.body.project
  let newProject = new Project({
    name: formData.name,
    startDate: formData.startDate,
    endDate: formData.endDate,
    lead: req.user.name
  })

  newProject.save().then(
    User.findByIdAndUpdate(req.user.id, {
      project: newProject.name
    }).then(() => res.redirect("/manageProject"))
  )
})

//add members to your team if the member has no team
router.put("/add", (req, res) => {
  let project = req.body.member.projectName
  let newMember = req.body.member.name
  User.findOne({ name: newMember })
    .then(member => {
      if (!member) console.log("user not found")
      else if (member.project) console.log("user is already part of a project")
      else {
        User.update(member, {
          project: project
        }).then(console.log("user updated with new project"))
      }
    })
    .catch(err => {
      console.log(err)
    })
})

//leave a team
router.delete("/", (req, res) => {
  User.findByIdAndUpdate(req.user.id, {
    project: ""
  }).then(() => {
    res.redirect("/manageProject")
  })
})

module.exports = router