const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decoder = new TextDecoder('shift_jis');

async function generateDocFrom(url, decoder) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(500);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// fetch page
const type = 'dm';
const baseUrl = `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/music.html?gtype=${type}`;
const baseDoc = await generateDocFrom(baseUrl, decoder);

const categories = [];
const titles = [];

options = baseDoc.getElementsByTagName('option');
for (o of options) {
  if (!o.getAttribute('disabled')) {
    categories.push(o.innerText);
  }
}

for (let i = 0; i < categories.length; i++) {
  // fetch html by specified category
  const url = `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/music.html?gtype=${type}&cat=${i}`;
  const doc = await generateDocFrom(url, decoder);

  for (music of doc.getElementsByClassName('title_box')) {
    const title = music.innerText.trim();
    if (!title.endsWith(' (CLASSIC)')) {
      titles.push(title);
    }
  }
  await sleep(5000);
}

console.log(categories);
console.log(titles);
console.log(JSON.stringify(titles));
