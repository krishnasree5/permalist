import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended: "true"}));
app.use(express.static("public"));

const db = new pg.Client({
    user: "postgres",
    database: "permalist",
    host: "localhost",
    password: "krishna23",
    port: 5432
});

db.connect();

let tasks = [];

app.get("/",async (req, res) => {
    const result = await db.query("SELECT * FROM tasks");
    tasks = result.rows;
    res.render("index.ejs",{tasks: tasks});

});

app.post("/add", async (req, res) => {
    const newTask = req.body.newtask;
    
    try {
        if(newTask){
            await db.query("INSERT INTO tasks(task) VALUES ($1)",[newTask]);
            res.redirect("/");

        }else{
            console.log("Task is an empty string");
            res.redirect("/");
        }
        
    } catch (error) {
        console.log(error);
        res.redirect("/");
    }
    
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});