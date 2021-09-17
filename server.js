import { JSONFileSync, Low } from 'lowdb';

import cors from 'cors';
import { dirname } from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import internalIp from 'internal-ip';
import open from 'open';

const app = express();
const port = 3000;
const __dirname = dirname(fileURLToPath(import.meta.url));
const adapter = new JSONFileSync('db.json');
const db = new Low(adapter);

await db.read();
db.data ||= { posts: [] };

const { posts } = db.data;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/public/index.html');
});
app.get('/connect', (req, res) => {
	res.sendFile(__dirname + '/public/connect.html');
});

app.get('/droplets', async (req, res) => {
	res.send(db.data);
});

app.post('/submit', async (req, res) => {
	const post = posts.push(req.body.content);
	await db.write();
	res.send('' + post);
	console.log('Submitted Droplet: ' + req.body.content);
});

app.post('/delete/:id', async (req, res) => {
	var id = req.params.id;
	console.log('Removing Droplet with the ID of: ' + id);
	posts.splice(id, 1);
	await db.write();
	res.sendStatus(200);
});

app.post('/deleteall', async (req, res) => {
	console.log('Deleting all Droplets');

	while (posts.length) {
		posts.pop();
	}

	await db.write();
	res.sendStatus(200);
});

// Only use in production build
await open(`http://${internalIp.v4.sync()}:${port}`);

app.listen(port, () => {
	console.log(`Braindrop running on http://${internalIp.v4.sync()}:${port}`);
	console.log(
		'Use the above address to access Braindrop from other devices on your network.'
	);
});
