/* ********
  AUTHOR: Lachlan Kermode
  DATE: 25 February 2016 (Thursday)
  DESCRIPTION: enable double click to transform selected word into either greek or latin
  NOTES:
    jquery preloaded in 'manifest.json'

******** */
console.log('running paideiafy.js');
var event = 0;
var lang;
var saved = "";

function quizlet() {
  insertDiv('<div id="paideia-panel"><b>Just copy and paste the text below into the import space when creating a Quizlet set.</b><br>' + 
    '<div id="vocab"><pre style="font-size: 12px; font-family: Geneva, sans-serif; text-align: left;">' + saved + '</pre></div>' + 
    '<button id="copy">Highlight, then Ctrl/Cmd-C to copy!</button>' + 
    '<button id="go-quizlet">Open Quizlet in new tab!</button>' + 
    '<button id="remove">Close</button></div>');
  $('#remove').click(rmPanel);
  document.getElementById('copy').addEventListener('click', function() { selectText('vocab'); });
  document.getElementById('go-quizlet').addEventListener('click', function() {
    window.open("https://quizlet.com/create-set", "Quizlet-Tab");
  });
}

function selectText(containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}

function anotherDictionary (word) {
  return '<p>Try this word in another dictionary: </p>' +
    '<ul class="another-dict">' +
      '<li><a target="_blank" href="http://logeion.uchicago.edu/index.html#'+ word + '">Logeion</a></li>' +
      '<li><a target="_blank" href="http://www.perseus.tufts.edu/hopper/resolveform?type=exact&lookup=&lang=greek">Perseus LSJ</a></li>' +
    '</ul>'
};

function rmPanel() {
  var last = document.getElementById('paideia-panel');
  if (last) last.remove();
}

function insertDiv(child) {
  var div = document.createElement('div');
  div.setAttribute('id', 'paideia-panel');
  div.setAttribute('style', 'position: fixed; top: 1em; right: 1em; padding: 10px 20px; '
    +'border: 1px solid #007095; border-radius: 2em; max-width: 34em;'
    +' word-wrap: break-word; background-color: aliceblue; z-index:999;');

  rmPanel()

  var rawHTML = child;
  var innerDiv = document.createElement('div');
  innerDiv.innerHTML = rawHTML;
  div.appendChild(innerDiv);
  document.body.appendChild(div);
}

function manualSearch(word) {
  insertDiv(
    '<div class="container" id="paideia-panel"><div class="row">' +
    '<h2 style="margin:0;font-size:16px;font-weight:bold;">Sorry!</h2> ' +
    '<p>We couldn\'t find any results for this entry.</p>' +
    anotherDictionary(word) +
    '<p>Or try typing the word manually:</p>' +
    '</div><div class="row">' +
    '<div class="col-xs-6 col-xs-offset-3 paideia-input">' +
    '  <input type="text" id="manual-paideia-entry" class="form-control" placeholder="type your word here...">' +
    '  <br>' +
    '  <div style="text-align:center;">' +
    '    <button class="paideia-button" type="submit" id="manual-paideia-search">Search</button>' +
    '    <button class="paideia-button" id="cancel-paideia">Cancel</button>' +
    '  </div>' +
    '</div>' +
    '</div></div>'
  );
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
  var thanks = '<hr style="margin-top: 2em;" /><footer style="font-size:10px; text-align: left;">Morphology provided by Morpheus from the <a href="http://www.perseus.tufts.edu/hopper/">Perseus Digital Library</a> at Tufts University.</footer>';
  var perseus = $('<div/>').html(toReturn).contents();
  lemma = perseus.find('.lemma');
  resultFound = perseus.find('.lemma').html(); // will be undefined if perseus finds no results
  if (resultFound) {
    var header = lemma.find('.lemma_header').prop('outerHTML');
    var def = lemma.find('.lemma_definition')[0];
    saved += word + '\t' + def.innerHTML.trim() + '\n';
    console.log(saved);
    table = lemma.find('table').addClass('paideia-table').prop('outerHTML');
    insertDiv('<div id="paideia-panel"><button id="remove" style="float: right;">X</button>' + header + "<br />" + table + anotherDictionary(word) + thanks + '</div>');
    $('#remove').click(rmPanel);
  } 
  else manualSearch(word);
}

function paidieaify(word, language) {
  var langCode = 'la'; // latin by default
  if (language == 'greek') langCode = 'greek';

  console.log("before ajax");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) parseAjax(word, xhttp.responseText);
  };
  xhttp.open("GET", 'http://www.perseus.tufts.edu/hopper/morph?l='+ word + '&la='+langCode, true);
  xhttp.setRequestHeader("cache-control", "no-cache");
  xhttp.send();
}

function runPaideiaChromium(language) {
  lang = language;
  if (event == 0) {
    event = 1;
    document.body.addEventListener('dblclick', function(info) {
      paidieaify(window.getSelection().toString(), lang);
    });
  }
}