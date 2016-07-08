/* ********
  AUTHOR: Lachlan Kermode
  DATE: 25 February 2016 (Thursday)
  DESCRIPTION: enable double click to transform selected word into either greek or latin
  NOTES:
    jquery preloaded in 'manifest.json'

  AUTHOR: Lucy Lin
  DATE: 21 June 2016 (Tuesday)
  DESCRIPTION:
    enable quizlet functionality
    fixed glitch that would toggle between Latin and Greek definitions when clicking the popup in the same session more than once
  NOTES:
    executeCopy function uses document.execCommand('Copy') which is only compatible with Chrome and Firefox

******** */
console.log('running paideiafy.js');
var event = 0;
var lang;
var saved = "";

function appendChildHere(mother, children) {
  for (var i = 0; i < children.length; i++) mother.appendChild(children[i]);
}

function setAttributesHere(mother, attributes) {
  for (var i = 0; i < attributes.length; i+=2) mother.setAttribute(attributes[i], attributes[i+1]);
}

function attributeChild(mother, attributes, children) {
  setAttributesHere(mother, attributes);
  appendChildHere(mother, children);
}

function quizlet() {
  var divChild = document.createElement('div');
  var divPanel = document.createElement('div');
  setAttributesHere(divPanel, ['id', 'paideia-panel']);

  var directions = document.createElement('h2');
  attributeChild(directions, ['style', 'font-size:14px;font-weight:bold;margin:0;font-family:inherit;'], [document.createTextNode('Just copy and paste the text below into the import space when creating a Quizlet set.')]);

  var divVocab = document.createElement('div');
  setAttributesHere(divVocab, ['id', 'vocab']);

  var saveDef = document.createElement('pre');
  appendChildHere(saveDef, [document.createTextNode(saved)]);
  appendChildHere(divVocab, [saveDef]);

  var copyButt = document.createElement('button');
  attributeChild(copyButt, ['id', 'copy'], [document.createTextNode('Copy vocabulary to clipboard!')]);
  var quizButt = document.createElement('button');
  attributeChild(quizButt, ['id', 'go-quizlet'], [document.createTextNode('Open Quizlet in new tab')]);
  var remButt = document.createElement('button');
  attributeChild(remButt, ['id', 'remove2'], [document.createTextNode('Close')]);

  var divChildren = [directions, divVocab, copyButt, quizButt, remButt, document.createElement('br')];
  appendChildHere(divPanel, divChildren);
  appendChildHere(divChild, [divPanel]);
  insertDiv2(divChild);

  $('#remove2').click(rmPanel);
  document.getElementById('copy').addEventListener('click', function() {executeCopy(saved);});
  document.getElementById('go-quizlet').addEventListener('click', function() {
    window.open("https://quizlet.com/create-set", "Quizlet-Tab");
  });
}

function executeCopy(text) {
  var input = document.createElement('textarea');
  document.getElementById('paideia-panel').appendChild(input);
  input.value = text;
  input.focus();
  input.select();
  document.execCommand('Copy');
  input.remove();
}

function anotherDictionary (word) {
  var anotherDiv = document.createElement('div');
  setAttributesHere(anotherDiv, ['id', 'another-div']);
  var tryThis = document.createElement('h5');
  attributeChild(tryThis, ['style', 'padding-bottom:0.7em;'], [document.createTextNode('Try this word in another dictionary: ')]);
  var anotherDict = document.createElement('div');
  setAttributesHere(anotherDict, ['class', 'another-dict']);

  var logeionImg = document.createElement('img');
  setAttributesHere(logeionImg, ['src', chrome.extension.getURL("logeion.jpeg"), 'alt', 'Logeion Icon', 'style', 'width:0.7em;height:0.7em;'])
  var logeionH = document.createElement('h3');
  var logeionLink = document.createElement('a');
  attributeChild(logeionLink, ['target', '_blank', 'href', 'http://logeion.uchicago.edu/index.html#'+ word], [document.createTextNode('Logeion')]);
  appendChildHere(logeionH, [logeionLink]);

  var perseusImg = document.createElement('img');
  setAttributesHere(perseusImg, ['src', chrome.extension.getURL("perseus.jpeg"), 'alt', 'Perseus Icon', 'style', 'width:0.7em;height:0.7em;'])

  var perseusH = document.createElement('h3');
  var perseusLink = document.createElement('a');
  attributeChild(perseusLink, ['target', '_blank', 'href', 'http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=' + 
      word + '&lang=' + lang], [document.createTextNode('Perseus')]);
  appendChildHere(perseusH, [perseusLink]);

  appendChildHere(anotherDict, [logeionImg, logeionH, perseusImg, perseusH]);
  appendChildHere(anotherDiv, [tryThis, anotherDict]);
  return anotherDiv;
}

function rmPanel() {
  var last = document.getElementById('paideia-panel');
  if (last) last.remove();
}

function insertDiv2(innerDiv) {
  var div = document.createElement('div');
  setAttributesHere(div, ['id', 'paideia-panel', 'style', 'position: fixed; top: 1em; right: 1em; padding: 10px 20px; border: 1px solid #007095; border-radius: 1em; width: 35%; max-height: 50%; overflow-y: scroll; word-wrap: break-word; background-color: aliceblue; z-index:999;']);
  rmPanel()
  appendChildHere(div, [innerDiv]);
  document.body.appendChild(div);
}

function manualSearch(word) {
  var divChild = document.createElement('div');

  var container = document.createElement('div');
  setAttributesHere(container, ['class', 'container', 'id', 'paideia-panel']);

  var row1 = document.createElement('div');
  setAttributesHere(row1, ['class', 'row']);

  var apology = document.createElement('p');
  attributeChild(apology, ['style', 'text-align: center; font-size: 16px; font-weight: bold;'], [document.createTextNode('Sorry!')]);
  var noResults = document.createElement('h5');
  attributeChild(noResults, ['style', 'padding-bottom:0.7em;'], [document.createTextNode('We couldn\'t find any results for this entry. Try this word in another dictionary:')]);

  var logeionH = document.createElement('h3');
  var logeionLink = document.createElement('a');
  attributeChild(logeionLink, ['target', '_blank', 'href', 'http://logeion.uchicago.edu/index.html#'+ word], [document.createTextNode('Logeion')]);
  appendChildHere(logeionH, [logeionLink]);
  var perseusH = document.createElement('h3');
  var perseusLink = document.createElement('a');
  attributeChild(perseusLink, ['target', '_blank', 'href', 'http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=' + 
      word + '&lang=' + lang], [document.createTextNode('Perseus')]);
  appendChildHere(perseusH, [perseusLink]);

  var typeIt = document.createElement('h5');
  appendChildHere(typeIt, [document.createTextNode('Or try typing the word manually:')]);

  appendChildHere(row1, [apology, noResults, logeionH, perseusH, document.createElement('br'), typeIt]);

  var row2 = document.createElement('div');
  setAttributesHere(row2, ['class', 'row']);

  var manEntry = document.createElement('div');
  setAttributesHere(manEntry, ['class', 'col-xs-6 col-xs-offset-3 paideia-input']);
  var inputBox = document.createElement('input');
  setAttributesHere(inputBox, ['type', 'text', 'id', 'manual-paideia-entry', 'class', 'form-control', 'placeholder', 'type your word here...']);
  var manButtons = document.createElement('div');
  setAttributesHere(manButtons, ['style', 'text-align:center;']);
  var manButt1 = document.createElement('button');
  attributeChild(manButt1, ['class', 'paideia-button', 'type', 'submit', 'id', 'manual-paideia-search'], [document.createTextNode('Search')]);
  var manButt2 = document.createElement('button');
  attributeChild(manButt2, ['class', 'paideia-button', 'id', 'cancel-paideia'], [document.createTextNode('Cancel')]);
  appendChildHere(manButtons, [manButt1, manButt2]);
  appendChildHere(manEntry, [inputBox, document.createElement('br'), manButtons]);

  appendChildHere(row2, [manEntry]);
  appendChildHere(container, [row1, row2]);
  appendChildHere(divChild, [container]);

  insertDiv2(divChild);

  $('#manual-paideia-search').click(function() {
    var manualPaideiaEntry = $('#manual-paideia-entry').val();
    rmPanel();
    console.log(manualPaideiaEntry);
    paidieaify(manualPaideiaEntry);
  });
  $('#cancel-paideia').click(rmPanel);
}

function parseAjax(word, toReturn) {
  console.log("parsing ajax");

  var resultFound = toReturn.indexOf('<div class="lemma_header">');
  console.log(resultFound);
  if (resultFound > 0) {
    var substring = toReturn.substring(resultFound, toReturn.indexOf("word_freq"));
    console.log(substring);

    var lemmaString = substring.substring(substring.indexOf('lemma_header')+13, substring.indexOf('</span>'));
    var lemmaHead = lemmaString.substring(lemmaString.indexOf('"'+lang+'"')+lang.length+3, lemmaString.indexOf('</h4>')).trim();
    var lemmaDef = lemmaString.substring(lemmaString.indexOf('lemma_definition')+18).trim();

    saved += lemmaHead + '\t' + lemmaDef + '\n';
    console.log(saved);

    var header = document.createElement('div');
    setAttributesHere(header, ['class', 'lemma_header']);

    var wordAgain = document.createElement('h4');
    attributeChild(wordAgain, ['class', lang], [document.createTextNode(lemmaHead)]);

    var def = document.createElement('span');
    attributeChild(def, ['class', 'lemma_definition'], [document.createTextNode(lemmaDef)]);

    appendChildHere(header, [wordAgain, def]);

    var tableString = substring.substring(substring.indexOf('<table>')+7, substring.indexOf('</table>'));
    console.log(tableString);

    var table = document.createElement('table');
    setAttributesHere(table, ['class', 'paideia-table']);
    var tbody = document.createElement('tbody');

    var tr = tableString.indexOf('<tr >');
    while (tr > 0) {
      var trow = document.createElement('tr');
      var td1 = document.createElement('td');
      setAttributesHere(td1, ['class', lang]);
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      setAttributesHere(td3, ['style', 'font-size: x-small']);

      var indexOfEndTd = tableString.indexOf('</td>');
      var td1text = tableString.substring(tableString.indexOf('"'+lang+'"')+lang.length+3, indexOfEndTd);
      console.log(td1text);

      var part2 = tableString.substring(indexOfEndTd+5);
      var td2text = part2.substring(part2.indexOf('<td>')+4, part2.indexOf('</td>'));
      console.log(td2text);

      td1.textContent = td1text;
      td2.textContent = td2text;

      appendChildHere(trow, [td1, td2, td3]);
      appendChildHere(tbody, [trow]);

      tableString = tableString.substring(tableString.indexOf('</tr>')+5);
      tr = tableString.indexOf('<tr >');
    }

    appendChildHere(table, [tbody]);

    var divChild = document.createElement('div');
    var divPanel = document.createElement('div');
    setAttributesHere(divPanel, ['id', 'paideia-panel']);

    var remButt = document.createElement('h4');
    attributeChild(remButt, ['id', 'remove', 'style', 'float: right; cursor:pointer; margin-top: 0px;'], [document.createTextNode('X')]);

    var line = document.createElement('hr');
    setAttributesHere(line, ['style', 'margin-top: 2em;']);

    var thanks = document.createElement('footer');
    var paideiaImg = document.createElement('img');
    setAttributesHere(paideiaImg, ['src', chrome.extension.getURL("paideia.png"), 'alt', 'Paidiea Icon', 'style', 'width:5em;height:5em;float:left;']);
    var paideiaLink = document.createElement('a');
    attributeChild(paideiaLink, ['href', 'http://paideiainstitute.org'], [document.createTextNode('Paideia Institute for Humanistic Study')]);
    var perseusLink = document.createElement('a');
    attributeChild(perseusLink, ['href', 'http://www.perseus.tufts.edu/hopper/'], [document.createTextNode('Perseus Digital Library')]);
    appendChildHere(thanks, [paideiaImg, document.createTextNode('Chiron was developed by the '), paideiaLink, document.createTextNode('.'), document.createElement('br'), document.createTextNode('Morphology provided by Morpheus from the '), perseusLink, document.createTextNode(' at Tufts University.')]);

    appendChildHere(divPanel, [remButt, anotherDictionary(word),  header, table, line, thanks]);
    appendChildHere(divChild, [divPanel]);
    insertDiv2(divChild);

    var thead = document.getElementsByClassName("paideia-table")[0].createTHead();
    var row = thead.insertRow();
    var cell1 = row.insertCell();
    var cell2 = row.insertCell();
    cell1.textContent = 'Form';
    cell2.textContent = 'Morphology';
    $('#remove').click(rmPanel);
  } 
  else manualSearch(word);
}

function paidieaify(word, language) {
  console.log("before ajax");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) parseAjax(word, xhttp.responseText);
  };
  xhttp.open("GET", 'http://www.perseus.tufts.edu/hopper/morph?l='+ word + '&la='+lang, true);
  xhttp.setRequestHeader("cache-control", "no-cache");
  xhttp.send();
}

function runPaideiaChromium(language) {
  lang = language;
  if (lang == "latin") lang = "la";
  if (event == 0) {
    event = 1;
    document.body.addEventListener('dblclick', function(info) {
      paidieaify(window.getSelection().toString(), lang);
    });
  }
}