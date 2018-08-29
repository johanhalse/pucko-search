# Pucko search

When you thought you needed something like [Lunr.js](https://lunrjs.com) but it turned out you only needed the dumbest search.

## It's so tiny!

Yup. It's designed to be more or less a drop-in for your lunr.js installation unless you're doing anything clever (so hands off those Levenshtein distances and fancy-pants vectors!) but it's only 2kb minified. The only thing it contains is a really basic algorithmic stemmer which is currently in, uh, Swedish, and a naive string search. That's what I needed when I wrote this.

## Installation

Install via npm, like this:

```bash
npm install --save-dev @johanhalse/pucko-search
```

## Usage

One difference between Lunr and Pucko when instantiating is that you need a `new` keyword. Otherwise the functions look pretty much the same:

```javascript
let idx = new Pucko(function() {
	this.ref("url");
	this.field("header");
	this.field("body");
	this.field("summary");

	myDocuments.forEach(function(doc) {
		this.add(doc);
	}, this);
});
```

## Function reference

`ref(String)`: change reference field

`field(String)`: make a field in your corpus searchable

`search(String)`: perform a search for your terms

When searching, Pucko will split any string it receives on spaces only, and the search is always case insensitive. Combined with the stemmer, this means that if you search for something like "Leva farligt" you'll get results that match the substrings `["lev", "farl"]`. You'll get a lot more results than Lunr, for sure.

Another difference versus Lunr is that you'll only get an array of strings back. Since Pucko isn't doing anything suspicious like tracking advanced matching data it makes no sense to wrap all your results with `{ ref: "foo" }`. All you'll get back is the ref string, and you'll damn well like it.
