import * as dao from "./dao.js";


export default function UserRoutes(app) {
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const findAllUsers = async (req, res) => {
        const users = await dao.findAllUsers();
        res.json(users);


    };
    const findUserById = async (req, res) => {
        console.log("findUserById called with userId:", req.params.userId);
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };

    const updateUser = async (req, res) => {
        const { userId } = req.params;
        const status = await dao.updateUser(userId, req.body);
        const currentUser = await dao.findUserById(userId);
        res.json(currentUser);
    };
    const signup = async (req, res) => {
        const user = await dao.findUserByUsername(req.body.username);
        if (user) {
            res.status(400).json(
                { message: "Username already taken" });
        }
        const currentUser = await dao.createUser(req.body);
        req.session["currentUser"] = currentUser;

        res.json(currentUser);
    };
    const signin = async (req, res) => {
        console.log("signin called with body:", req.body);
        const { username, password } = req.body;
        console.log('Attempting to sign in with', username, password);
        const user = await dao.findUserByCredentials(username, password);
        if (user) {
            req.session["currentUser"] = user;
            res.json(user);
        } else {
            console.log('No user found or incorrect password for', username);
            res.status(401).send('Unauthorized');
        }
    };


    const profile = async (req, res) => {
        if (req.session && req.session["currentUser"]) {
            res.json(req.session["currentUser"]);
        } else {
            res.sendStatus(401);
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };


    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);

    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", profile);

}