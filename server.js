const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json())

app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'))
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'db/db.json'))
});

app.post('/api/notes', (req, res) => {
    console.log(req.body);

    const {title, text} = req.body;

    const newNote = {
        title,
        text
    }

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNotes = JSON.parse(data);

            parsedNotes.push(newNote);

            fs.writeFile('./db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr => {
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully added new note!')
            }))
        }
    });
});

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () => {
    console.log(`app listening at http://localhost:${PORT}`)
});