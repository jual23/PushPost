const express = require('express');
const router = express.Router();
const fs = require('fs');



router.get('/', (req, res, next) => {
    let allChores    
    fs.readFile('./db/todo.json', 'utf-8', function (err, data) {
        if (err) throw err
        allChores = JSON.parse(data);
        res.status(200).json({
            todos: allChores.thingsToDo
        });
    });

})

router.post('/', (req, res, next) => {
    const newChore = {
        name: req.body.name,
        donde: req.body.donde || "Casa",
        eta: req.body.eta || 99,
        completed: false
    }
    if (!newChore.name) {
        return(
        res.status(400).json({
            error: "parametros invalidos"
        }));
    }

    
    try {
        fs.readFile('./db/todo.json', 'utf-8', function (err, data) {
            if (err) throw err
            let allChores = JSON.parse(data);
            allChores.thingsToDo.push(newChore);
            fs.writeFile("./db/todo.json", JSON.stringify(allChores), 'utf-8', function (err) {
            });
        })
        
        res.status(201).json({
            message: 'Order was created'
        });
    } catch (err) {
        res.status(400).json({
            error: err
        });        
    }
        

    
})

module.exports = router;  