const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function(req,res){
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});
app.get("*", function(req,res){
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/api/notes", function(req,res){
    var list = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    res.json(list);
});
app.post("/api/notes", function(req,res){
    var note = req.body;
    note.id = (Math.floor(Math.random()*10000));
    let notesArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    notesArray.push(note);
    fs.writeFileSync("./db/db.json", JSON.stringify(notesArray), "utf8");
    res.json(notesArray);
})
app.delete("/api/notes/:id", function(req,res){
    const {id} = req.params;
    let notesArray = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    for (let i = 0; i<notesArray.length; i++){
        if (notesArray[i].id === id){
            notesArray.splice(i,1);
            break;
        }
    }
    fs.writeFileSync("./db/db.json", JSON.stringify(notesArray), "utf8");
    res.json(notesArray);
});
app.listen(PORT, () => console.log("App listening on PORT: " + PORT));