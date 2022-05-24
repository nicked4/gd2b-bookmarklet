const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const decoder = new TextDecoder('shift_jis');

async function generateDocFrom(url, decoder) {
  const res = await fetch(url);
  const rawHtml = decoder.decode(await res.arrayBuffer());
  await sleep(500);
  return new DOMParser().parseFromString(rawHtml, 'text/html');
}

// fetch skill page
gtype = 'dm';
const skillUrls = [
  `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/skill.html?gtype=${gtype}&stype=0'`
  `https://p.eagate.573.jp/game/gfdm/gitadora_highvoltage/p/playdata/skill.html?gtype=${gtype}&stype=1'`
];
const skillDocs = [];

for (skillUrl of skillUrls) {
  skillDocs.push(await generateDocFrom(skillUrl, decoder));
}

// scrape skills
const sendSkills = [];

for (doc of skillDocs) {
  const skills = doc.getElementsByClassName('skill_table_tb')[0]
                    .getElementsByTagName('tbody')[0]
                    .getElementsByTagName('tr');

  for (skill of skills) {
    const labelDivs = skill.getElementsByClassName('seq_icon');

    const title = skill.getElementsByClassName('title')[0].innerText.trim();
    const instrument = labelDivs[0].getAttribute('class').split(' ')[1].replace('part_', '');
    const label = labelDivs[1].getAttribute('class').split(' ')[1].replace('diff_', '');
    const completionRate = skill.getElementsByClassName('achive_cell')[0]
                                .innerText.trim().replace('%', '');

    const sendSkill = {};
    sendSkill.title = title;
    sendSkill.label = label;
    sendSkill.instrument = instrument;
    sendSkill.completionRate = completionRate;

    sendSkills.push(sendSkill);
  }
}
console.log(JSON.stringify(sendSkills));

// send scraped skills
// TODO: implement me!
