const express = require('express');
const router = express.Router();
const Hamilton = require('../../db/todo.json');

router.get('/', (req, res, next) =>{
    res.send('funciona');
    console.log (Hamilton);
})

router.post('/', (req, res, next) =>{
    
})

module.exports = router;