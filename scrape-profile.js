const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decoder = new TextDecoder('shift_jis');

async function generateDocFrom(url, decoder) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(500);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// fetch and scrape profle page
const profileUrl = 'https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/profile.html';
profileDoc = await generateDocFrom(profileUrl, decoder);

const gitadoraId = profileDoc.getElementsByClassName('common_frame_date')[0].innerText.trim();
const name = profileDoc.getElementsByClassName('profile_name_frame')[0].innerText.trim();
const title = profileDoc.getElementsByClassName('profile_shogo_frame')[0].innerText.trim();

const profile = {
  gitadoraId: gitadoraId,
  name: name,
  title: title,
}
