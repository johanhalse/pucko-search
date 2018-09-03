class PuckoSearch {
  constructor(cb) {
    this.fields = [];
    this.corpus = [];
    cb.bind(this)();
  }

  ref(refId) {
    this.id_field = refId;
  }

  field(fieldName) {
    if (this.fields.indexOf(fieldName) === -1) {
      this.fields.push(fieldName);
    }
  }

  add(doc) {
    if (this.getDocByIdField(this.id_field)(doc[this.id_field])) {
      console.warn("id already exists");
      return;
    }
    this.corpus.push(doc);
  }

  getDocByIdField(id_field) {
    return id => {
      return this.corpus.find(item => item[id_field] === id);
    };
  }

  processSearchTerms(str) {
    // A somewhat WTF way of flattening an array while waiting for flatMap
    return [].concat(...str.split(" ").map(this.stem));
  }

  stem(str) {
    let suffixes = [
      "ernas",
      "andes",
      "andet",
      "ande",
      "erna",
      "orna",
      "erns",
      "aste",
      "ade",
      "arna",
      "igt",
      "iga",
      "are",
      "ern",
      "ig",
      "or",
      "as",
      "es",
      "ast",
      "ad",
      "at",
      "it",
      "a",
      "e"
    ];

    let lowerStr = str.toLowerCase();

    return suffixes
      .map(suffix => {
        if (lowerStr.toLowerCase().slice(-suffix.length) === suffix) {
          return lowerStr
            .toLowerCase()
            .substr(0, lowerStr.length - suffix.length);
        }
      })
      .filter(item => item !== undefined)
      .concat([lowerStr]);
  }

  search(str) {
    return this.corpus
      .filter(this.includesTerms(this.fields, this.processSearchTerms(str)))
      .map(item => item[this.id_field]);
  }

  includesTerms(fields, strings) {
    return item => {
      for (let i = 0; i < strings.length; i++) {
        for (let j = 0; j < fields.length; j++) {
          if (item[fields[j]].toLowerCase().indexOf(strings[i]) > -1) {
            return true;
          }
        }
      }
      return false;
    };
  }
}

export default PuckoSearch;
