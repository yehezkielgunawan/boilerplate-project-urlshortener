require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

const url = require("url");
const urlMap = new Map();
let counter = 1;

app.use(cors());
// Add body-parser middleware before routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
	res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", (req, res) => {
	res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", (req, res) => {
	const urlString = req.body.url;

	try {
		const parsedUrl = new URL(urlString);
		if (!["http:", "https:"].includes(parsedUrl.protocol)) {
			throw new Error("Invalid protocol");
		}

		urlMap.set(counter, urlString);
		res.json({
			original_url: urlString,
			short_url: counter++,
		});
	} catch (err) {
		res.json({ error: "invalid url" });
	}
});

app.get("/api/shorturl/:short_url", (req, res) => {
	const shortUrl = Number.parseInt(req.params.short_url);
	const originalUrl = urlMap.get(shortUrl);

	if (originalUrl) {
		res.redirect(originalUrl);
	} else {
		res.json({ error: "No short URL found" });
	}
});

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
