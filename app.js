const express = require("express");
const app = express();
const fetch = require("node-fetch");
// Parsing library
const cheerio = require("cheerio");

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
	console.log("Server started on port:", PORT);
});

// Use ejs for templating
app.set("view engine", "ejs");
// Use the static files in the public directory
app.use(express.static(__dirname + "/public"));

// Get Request
app.get("/", async (req, res) => {
	// Get the HTML from the main page
	const ycombinatorReq = await fetch("https://news.ycombinator.com/");
	const html = await ycombinatorReq.text();
	// Load it into cheerio to parse
	const $ = cheerio.load(html);
	const stories = [];
	// Loop through each story element
	$(".storylink").each((i, elem) => {
		// Create a temporary object to hold info about the story
		const temp = {};
		// Grab the title and the link
		temp.title = $(elem).text();
		temp.link = $(elem).attr("href");
		// Push the temporary object into the final stories array
		stories.push(temp);
	});
	// Render the main page while passing the stories to the front end
	res.render("index", { stories });
});
