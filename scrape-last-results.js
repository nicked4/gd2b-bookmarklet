const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decoder = new TextDecoder('shift_jis');

async function generateDocFrom(url, decoder) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(500);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// fetch user info
const gitadoraId = '00010F58D7'
// const gitadoraId = '0123456789'
const userName = 'もこ田メメメントモリ'
const userTitle = '赤ちゃんの王'

// fetch first result page
gtype = 'dm';
const resultUrl = `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/stage_result.html?gtype=${gtype}`;
const resultDocs = [];
resultDocs.push(await generateDocFrom(resultUrl, decoder));

// fetch result urls
// TODO: 例外処理使う
const linkDivs = resultDocs[0].getElementsByClassName('sr_list_pager')[0]
                              .getElementsByTagName('div');

// TODO: 例外処理使う
for (i = 1; i < 4; i++) {
  const link = linkDivs[i].getElementsByTagName('a')[0]
                          .getAttribute('href');
  resultDocs.push(await generateDocFrom(link, decoder));
}

// scrape results
let sendResults = [];
const scoreMap = {
  dm_mst: { label: 'MASTER', instrument: 'DRUM' },
  dm_ext: { label: 'EXTREME', instrument: 'DRUM' },
  dm_adv: { label: 'ADVANCED', instrument: 'DRUM' },
  dm_bsc: { label: 'BASIC', instrument: 'DRUM' },
  gf_mst: { label: 'MASTER', instrument: 'GUITAR' },
  gf_ext: { label: 'EXTREME', instrument: 'GUITAR' },
  gf_adv: { label: 'ADVANCED', instrument: 'GUITAR' },
  gf_bsc: { label: 'BASIC', instrument: 'GUITAR' },
  bass_mst: { label: 'MASTER', instrument: 'BASS' },
  bass_ext: { label: 'EXTREME', instrument: 'BASS' },
  bass_adv: { label: 'ADVANCED', instrument: 'BASS' },
  bass_bsc: { label: 'BASIC', instrument: 'BASS' },
};

for (doc of resultDocs) {
  const results = doc.getElementsByClassName('sr_list_tb');

  for (r of results) {
    const title = r.getElementsByClassName('title')[0].innerText.trim();
    const rows = r.getElementsByClassName('score_title');
    const score = r.getElementsByClassName('score_data_diff')[0]
                   .getAttribute('class').split(' ')[1];

    const music = {};
    const difficulty = {};
    const result = {};

    music.title = title;
    difficulty.label = scoreMap[score].label;
    difficulty.instrument = scoreMap[score].instrument;
    // FIXME:
    difficulty.classic = false;

    for (row of rows) {
      let attr = row.innerText;
      let value = row.parentNode.getElementsByClassName('score_data')[0].innerText;
      if (attr == 'SCORE') {
        result.score = value;
      } else if (attr == 'PERFECT') {
        result.perfect = value;
      } else if (attr == 'GREAT') {
        result.great = value;
      } else if (attr == 'GOOD') {
        result.good = value;
      } else if (attr == 'OK') {
        result.ok = value;
      } else if (attr == 'MISS') {
        result.miss = value;
      } else if (attr == 'MAX COMBO') {
        result.maxCombo = value;
      } else if (attr == '達成率') {
        result.completionRate = value.replace('%', '');
      }
    }

    const phraseCombo = [];
    const comboMeter = r.getElementsByClassName('phrase_combo_meter')[0]
                        .getElementsByClassName('meter_block');
    for (phrase of comboMeter) {
      const classes = phrase.getAttribute('class').split(' ');
      if (classes.includes('block_stat_0_1') | classes.includes('block_stat_1_1')) {
        phraseCombo.push(false);
      }
      if (classes.includes('block_stat_0_2') | classes.includes('block_stat_1_2')) {
        phraseCombo.push(true);
      }
    }
    result.phraseCombo = phraseCombo;

    difficulty.result = result;
    music.difficulties = [difficulty]

    sendResults.push(music);
  }
}

const request = {
  user: {
    name: userName,
    title: userTitle,
    gitadoraId: gitadoraId,
  },
  recordedSeriesId: 11,
  musics: sendResults,
}

console.log(sendResults);

const gd2bUrl = 'http://localhost:8080/results'
const gd2bResponse = await fetch(
  gd2bUrl,
  {
    'method': 'PUT',
    'body': JSON.stringify(request),
    'headers': {'Content-Type': 'application/json'}
  }
)
console.log(await gd2bResponse.text())
