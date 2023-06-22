const express = require('express');
const path = require('path');
const fs = require('fs');
const {v4 : uuidv4} = require('uuid')

const app = express();
const PORT = 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    const {title, text} = req.body;

    const newNote = {
        title,
        text,
        id: uuidv4()
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

app.delete(`/api/notes/:id`, (req, res) => {
    const noteID = req.params.id;

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedNotes = JSON.parse(data);

            const index = parsedNotes.findIndex((obj) => obj.id === noteID)

            if (index > -1) {
                parsedNotes.splice(index, 1);
            }

            fs.writeFile('./db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr => {
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully removed a note!')
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