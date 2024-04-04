
import Database from "../Database/index.js";

export default function AssignmentsRoutes(app) {

    app.post("/api/courses/:cid/assignments", (req, res) => {
        try {
            const { cid } = req.params;
            const newAssignment = {
                ...req.body,
                course: cid,
                _id: new Date().getTime().toString(),
            };
            Database.assignments.push(newAssignment);
            res.status(201).send(newAssignment);
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Failed to create a new assignment." });
        }
    });


    app.get("/api/courses/:cid/assignments", (req, res) => {
        const { cid } = req.params;
        const assignments = Database.assignments.filter((a) => a.course === cid);
        res.send(assignments);
    });


    app.put("/api/assignments/:id", (req, res) => {
        const { id } = req.params;
        const updatedAssignment = req.body;
        let found = false;
        Database.assignments = Database.assignments.map((a) => {
            if (a._id === id) {
                found = true;
                return { ...a, ...updatedAssignment };
            }
            return a;
        });

        if (!found) {
            res.status(404).send({ message: "Assignment not found" });
        } else {
            res.sendStatus(204);
        }
    });


    app.delete("/api/assignments/:id", (req, res) => {
        const { id } = req.params;
        Database.assignments = Database.assignments.filter((a) => a._id.toString()  !== id);
        res.sendStatus(200);
    });





    app.get("/api/assignments", (req, res) => {
        const assignments = Database.assignments;
        res.send(assignments);
    });
}
