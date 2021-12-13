const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post('/userSigin', controller.userSigin);
router.get('/getUserTasks', controller.getUserTasks);
router.post('/addTask', controller.addTask);
router.post('/removeTask', controller.removeTask);
router.post('/completeToggle', controller.completeToggle);

router.get("/", (req, res) => {
    res.send("Hello World");
});

module.exports = router;
