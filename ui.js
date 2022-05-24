const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decoder = new TextDecoder('shift_jis');

async function generateDocFrom(url, decoder, delayMs) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(delayMs);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

function resetDocument() {
  while(document.firstChild) {
    document.removeChild(document.firstChild);
  }
}

function exec() {
  const doesExec = confirm('以下の対象のデータを収集します\n' + typeSelect.value + ': ' + waySelect.value);
  if (doesExec) {
    resetDocument();

    if (waySelect.value === lastResults) {
      scrapeLastResults(typeSelect.value, waySelect.value);
    }
    else if (waySelect.value === skillResults) {
      scrapeSkillResults(typeSelect.value, waySelect.value);
    }
    else if (waySelect.value === allResults) {
      scrapeAllResults(typeSelect.value, waySelect.value);
    }
  }
}

function scrapeLastResults(type, way) {
  console.log(`${type}, ${way}: scrape last results`);
}

function scrapeSkillResults(type, way) {
  console.log(`${type}, ${way}: scrape skill results`);
}

function scrapeAllResults(type, way) {
  console.log(`${type}, ${way}: scrape all results`);
}

// scrape parameters
const ms = 5000;

// print strings
const dm = 'DrumMania';
const gf = 'GuitarFreaks';
const lastResults = 'プレー履歴';
const skillResults = 'スキル対象';
const allResults = '全曲';

// create type selector
const typeSelect = document.createElement('select');
typeSelect.setAttribute('id', 'type');
const optionDM = document.createElement('option');
const optionGF = document.createElement('option');
optionDM.value = dm;
optionGF.value = gf;
optionDM.text = dm;
optionGF.text = gf;
typeSelect.appendChild(optionDM);
typeSelect.appendChild(optionGF);

// create way selector
const waySelect = document.createElement('select');
waySelect.setAttribute('id', 'waySelect');
const optionLastResults = document.createElement('option');
const optionSkillResults = document.createElement('option');
const optionAllResults = document.createElement('option');
optionLastResults.value = lastResults;
optionSkillResults.value = skillResults;
optionAllResults.value = allResults;
optionLastResults.text = lastResults;
optionSkillResults.text = skillResults;
optionAllResults.text = allResults;
waySelect.appendChild(optionLastResults);
waySelect.appendChild(optionSkillResults);
waySelect.appendChild(optionAllResults);

// create exec button
const execButton = document.createElement('button');
execButton.setAttribute('id', 'execButton');
execButton.setAttribute('type', 'button');
execButton.addEventListener('click', exec);
execButton.innerText = '実行';

// render
resetDocument();
root = document.createElement('html');
body = document.createElement('body');
body.setAttribute('style', 'margin: 24px;')
document.appendChild(root);
root.appendChild(body);
body.appendChild(typeSelect);
body.appendChild(waySelect);
body.appendChild(execButton);
