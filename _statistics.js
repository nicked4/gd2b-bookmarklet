// gitadora homepage 用のスクリプトで GD2B には利用しないよ
let script = document.createElement('script');
script.src = 'https://unpkg.com/simple-statistics@7.0.2/dist/simple-statistics.min.js';
document.body.appendChild(script);

let skills = [];
Array.from(document.getElementsByClassName('skill_cell'))
  .forEach(c => skills.push(parseFloat(c.textContent.replace('pts', '').trim())));

console.log('Sum: ' + ss.sum(skills));
console.log('Max: ' + ss.max(skills));
console.log('Ave: ' + ss.mean(skills));
console.log('Min: ' + ss.min(skills));
console.log('Var: ' + ss.variance(skills));
