const express = require('express');
const router = express.Router();
const fs = require('fs');
const dbpath = './db/todo.json';

router.get('/', async (req, res, next) => {

	try {
        // const data = await readFile(dbpath);
        const data = fs.readFileSync(dbpath);
		res.send(JSON.parse(data));
	} catch (e) {
		res.status(500).send({ error: e.message });
	}
});

router.post('/', (req, res, next) => {
    if (!req.body.name) {
		return res.status(400).json({
			error: 'Please provide a name'
		});
    }

    const chore = {
		id: 1,
		name: req.body.name,
		where: req.body.where || null,
		eta: req.body.eta || 99,
		completed: false
    };

    let chores = [chore];
    
    if (fs.existsSync(dbpath)) {
        chores = JSON.parse(fs.readFileSync(dbpath,  'utf-8'));
    }

    if(chores.length >= 1) {
        chore.id = chores.length + 1;
    }

    chores.push(chore);

    fs.writeFileSync(dbpath, JSON.stringify(chores), 'utf-8');
    res.send(chores);
});

router.delete('/:id',(req,res,next) =>{
    if (isNaN(req.params.id)) {
        res.status(400).send({'error':'ID must be a number'});
        return;
    }
    if (!Number.isInteger(Number(req.params.id))) {
        res.status(400).send({'error':'ID must be an integer'});
        return;
    }
    const id = parseInt(req.params.id);

    if (!fs.existsSync(dbpath)){
        res.status(404).send({'error':'The file could not be found'});
        return;
    }
    
    

    let chores = JSON.parse(fs.readFileSync(dbpath,  'utf-8'));
    let chore = null
    chores = chores.filter((c) => {
        if (c.id === id) {
            chore = c;
            return false
        }
        return true;
    });

    if (chore == null) {
        res.status(404).send({'error':'The ID provided could not be found'});
        return
    }
    fs.writeFileSync(dbpath, JSON.stringify(chores), 'utf-8');
    res.send(chore);
})

router.get('/:id', (req,res,next)=>{
    if (isNaN(req.params.id)) {
        res.status(400).send({'error':'ID must be a number'});
        return;
    }
    if (!Number.isInteger(Number(req.params.id))) {
        res.status(400).send({'error':'ID must be an integer'});
        return;
    }
    const id = parseInt(req.params.id);

    if (!fs.existsSync(dbpath)){
        res.status(404).send({'error':'The file could not be found'});
        return;
    }

    let chores = JSON.parse(fs.readFileSync(dbpath,  'utf-8'));
    for (let chore of chores) {
        if (id == chore.id){
            res.send(chore);
            return
        }
    }

    res.status(400).send({'error':'ID not found'});
})

function readFile(filePath) {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, (err, data) => {
			if (!!err) {
				reject(err);
				return;
			}

			resolve(data);
		});
	});
}

module.exports = router;
