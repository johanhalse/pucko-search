import Pucko from "./pucko-search";

let corpus = [
  {
    url: "https://www.example.com/1",
    header: "Villkoret",
    body:
      "Utan att handla \
      kan jag icke leva, \
      fjättrad vid lyran skulle jag dö. \
      Är ock mig lyran det högsta på jorden \
      bleve jag den trogen, \
      vore jag icke en flammande själ. \
      Den som icke med blodiga naglar \
      bryter sin bräcka i vardagens mur \
      - må förgås därutanför - \
      han ej är värd att skåda solen.",
    summary: "Nu sänder jag pansartåg med stenhårda masker i hotande gluggar"
  },
  {
    url: "https://www.example.com/2",
    header: "Sorglöshet",
    body:
      "Jag tror ej på människor. \
      Jag hade slagit min lyra i stycken, \
      trodde jag ej på Gud. \
      Gud visar mig vägen \
      ur dimman till solens strålande disk. \
      Han älskar de lättfota vandrare. \
      Därför gav han mig all denna sorglöshet. \
      Jag litar fast som på ett hälleberg. \
      Är jag hans rätta barn - kan mig intet hända.",
    summary: "Jag har krafter. Jag fruktar ingenting."
  }
];

let idx = new Pucko(function() {
  this.ref("url");
  this.field("header");
  this.field("body");

  corpus.forEach(doc => {
    this.add(doc);
  }, this);
});

test("Finds exact string in header", () => {
  expect(idx.search("Villkoret")).toEqual(["https://www.example.com/1"]);
  expect(idx.search("villkoret")).toEqual(["https://www.example.com/1"]);
});

test("Finds stemmed strings in body", () => {
  expect(idx.search("bryt")).toEqual(["https://www.example.com/1"]);
  expect(idx.search("solen")).toEqual([
    "https://www.example.com/1",
    "https://www.example.com/2"
  ]);
  expect(idx.search("strål")).toEqual(["https://www.example.com/2"]);
});

test("Searches only in added fields", () => {
  expect(idx.search("pansartåg")).toEqual([]);
});

test("Searches in split string", () => {
  expect(idx.search("villkor sorglöshet")).toEqual([
    "https://www.example.com/1",
    "https://www.example.com/2"
  ]);
});
