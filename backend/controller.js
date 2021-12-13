const User = require("./models/user");
const Task = require("./models/task");
let nodemailer = require("nodemailer");
let cron = require("node-cron");
var schedule = require("node-schedule");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "workspacemanagement78@gmail.com",
        pass: "workspace123",
    },
});

exports.userSigin = async (req, res) => {
    console.log("userSignin");
    console.log(req.body);
    const { name, email } = req.body;
    try {
        if (!name || !email) {
            res.send("Missing name or email");
        }
        const userExist = await User.findOne({ name });
        console.log(userExist);
        if (!userExist) {
            const newUser = new User({
                name: name,
                email: email,
            });
            const userSaved = await newUser.save();
            return res.status(200).send("User saved");
        } else {
            res.send("User already exist");
        }
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

exports.getUserTasks = async (req, res) => {
    try {
        console.log("getUserTasks");
        console.log(req.query);
        const { username } = req.query;
        const user = await User.findOne({ name: username });
        console.log(user);
        if (!user) {
            res.send("User not found");
        }
        const tasks = await Task.find({ _id: { $in: user.tasks } });
        res.status(200).send(tasks);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

exports.completeToggle = async (req, res) => {
    try {
        console.log("completeToggle");
        console.log(req.body);
        const task = await Task.findOne({ _id: req.body.taskId });
        if (!task) {
            res.send("Task not found");
        }
        console.log(task);
        task.completed = !task.completed;
        const taskSaved = await task.save();
        if (!taskSaved) {
            res.send("Task not saved");
        }
        res.status(200).send("Task saved");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

exports.removeTask = async (req, res) => {
    try {
        console.log("removeTask");
        console.log(req.body);
        const { taskId, username } = req.body;
        const task = await Task.findById(taskId);
        if (!task) {
            res.send("Task not found");
        }
        const user = await User.findOne({ name: username });
        if (!user) {
            res.send("User not found");
        }
        user.tasks.pull(taskId);
        const userSaved = await user.save();
        if (!userSaved) {
            res.send("User not saved");
        }
        const taskSaved = await Task.findByIdAndDelete(taskId);
        if (!taskSaved) {
            res.send("Task not saved");
        }
        res.status(200).send("Task deleted");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

exports.addTask = async (req, res) => {
    console.log(req.body);
    const { username, name, time, status } = req.body;
    try {
        const user = await User.findOne({ name: username });
        let timeToFinish = new Date(time);
        if (timeToFinish.getTime() < new Date().getTime()) {
            return res.send("Time to finish is in the past");
        } else {
            if (!user) {
                res.send("User not found");
            }
            const newTask = new Task({
                name: name,
                time: timeToFinish,
                completed: false,
            });
            let mailOptions = {
                from: "workspacemanagement78@gmail.com",
                to: user.email,
                subject: "Remainder to complete this task: " + newTask.name,
                text: "Complete the task: " + name,
            };
            // console.log(timeToFinish.getFullMonth());

            // cron.schedule(`* * * * ${timeToFinish.getFullYear}`, () => {
            //     transporter.sendMail(mailOptions, function (error, info) {
            //         if (error) {
            //             console.log(error);
            //         } else {
            //             console.log("Email sent: " + info.response);
            //         }
            //     });
            // });

            schedule.scheduleJob(timeToFinish, () => {
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Email sent: " + info.response);
                    }
                });
            });

            const taskSaved = await newTask.save();
            user.tasks.push(taskSaved);
            await user.save();
        }
        res.status(200).send("Task saved");
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};
