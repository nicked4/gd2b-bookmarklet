const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function generateDocFrom(url, decoder, delayMs) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(delayMs);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

const categories = [
  '数字・記号',
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
  ...'あかさたなはまやらわ'.split('').map(kana => kana + '行'),
];

// TODO: classic, fullcombo, other options...
const ms = 5000;
const gtype = 'dm';
const decoder = new TextDecoder('shift_jis');

const start = categories.findIndex((c) => c === 'か行');
const end = categories.findIndex((c) => c === 'や行');

// fetch category page
for (let i = start; i <= end; i++) {
  const musicUrl = `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/music.html?gtype=${gtype}&cat=${i}`;
  const musicDoc = await generateDocFrom(musicUrl, decoder, ms);
  const links = Array.from(musicDoc.getElementsByClassName('text_link'))
                     .map((a) => a.getAttribute('href'));

  const sendResults = [];

  // fetch each music page
  for (let link of links) {
    const resultDoc = await generateDocFrom(link, decoder, ms);
    let title = resultDoc.getElementsByClassName("live_title")[0].innerText.trim();
    let classic = false;
    const results = resultDoc.getElementsByClassName("music_detail");

    if (title.endsWith(' (CLASSIC)')) {
      title = title.substring(0, title.length - ' (CLASSIC)'.length);
      classic = true;
    }

    for (let result of results) {
      const label = result.getElementsByTagName('thead')[0]
                          .getElementsByTagName('th')[0]
                          .getAttribute('class').replace('diff_', '');
      const rankClassNames = result.getElementsByClassName('score_data_rank')[0]
                                   .getAttribute('class').split(' ');
      const rank = rankClassNames[rankClassNames.length - 1];
      const completionRate = result.getElementsByTagName('tbody')[0]
                                   .getElementsByTagName('tr')[3]
                                   .getElementsByTagName('td')[1].innerText.trim().replace('%', '');
      const score = result.getElementsByTagName('tbody')[0]
                          .getElementsByTagName('tr')[4]
                          .getElementsByTagName('td')[1].innerText.trim();

      const sendResult = {
        title: title,
        label: label,
        instrument: gtype === 'dm' ? 'DRUM' : '',
        classic: classic,
        rank: rank,
        completionRate: completionRate,
        score: score,
        fullCombo: undefined,
      };

      // cleanse sendResult property
      if (sendResult.rank === 'none') {
        delete sendResult.rank;
      }
      if (sendResult.completionRate === '-') {
        delete sendResult.completionRate;
      }
      if (sendResult.score === '0') {
        delete sendResult.score;
      }

      if (!(sendResult.hasOwnProperty('rank') |
            sendResult.hasOwnProperty('completionRate') |
            sendResult.hasOwnProperty('score'))) {
        continue;
      }

      sendResults.push(sendResult);
    }
    break;
  }
  console.log(sendResults);
}
