'use strict';

var PuckoSearch = function PuckoSearch(cb) {
  this.fields = [];
  this.corpus = [];
  cb.bind(this)();
};

PuckoSearch.prototype.ref = function ref (refId) {
  this.id_field = refId;
};

PuckoSearch.prototype.field = function field (fieldName) {
  if (this.fields.indexOf(fieldName) === -1) {
    this.fields.push(fieldName);
  }
};

PuckoSearch.prototype.add = function add (doc) {
  if (this.getDocByIdField(this.id_field)(doc[this.id_field])) {
    console.warn("id already exists");
    return;
  }
  this.corpus.push(doc);
};

PuckoSearch.prototype.getDocByIdField = function getDocByIdField (id_field) {
    var this$1 = this;

  return function (id) {
    return this$1.corpus.find(function (item) { return item[id_field] === id; });
  };
};

PuckoSearch.prototype.processSearchTerms = function processSearchTerms (str) {
    var ref;

  // A somewhat WTF way of flattening an array while waiting for flatMap
  return (ref = []).concat.apply(
    ref, this.split(str.trim())
      .map(this.normalize)
      .map(this.stem)
  );
};

PuckoSearch.prototype.split = function split (str) {
  if (str.indexOf("^") === 0) {
    return [str.substr(1)];
  }
  return str.split(" ");
};

PuckoSearch.prototype.normalize = function normalize (str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

PuckoSearch.prototype.stem = function stem (str) {
  var suffixes = [
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

  var lowerStr = str.toLowerCase();

  return suffixes
    .map(function (suffix) {
      if (lowerStr.toLowerCase().slice(-suffix.length) === suffix) {
        return lowerStr
          .toLowerCase()
          .substr(0, lowerStr.length - suffix.length);
      }
    })
    .filter(function (item) { return item !== undefined; })
    .concat([lowerStr]);
};

PuckoSearch.prototype.search = function search (str) {
    var this$1 = this;

  return this.corpus
    .filter(this.includesTerms(this.fields, this.processSearchTerms(str)))
    .map(function (item) { return item[this$1.id_field]; });
};

PuckoSearch.prototype.includesTerms = function includesTerms (fields, strings) {
    var this$1 = this;

  return function (item) {
    for (var i = 0; i < strings.length; i++) {
      for (var j = 0; j < fields.length; j++) {
        if (
          this$1.normalize(item[fields[j]])
            .toLowerCase()
            .indexOf(strings[i]) > -1
        ) {
          return true;
        }
      }
    }
    return false;
  };
};

module.exports = PuckoSearch;
