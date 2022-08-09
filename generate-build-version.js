var fs = require('fs');
console.log('Generating build number... ' + process.env.ENV_CONFIG);
fs.readFile('src/data/buildVersion.json',function(err,content) {
  if (err) throw err;
  var metadata = JSON.parse(content);
  const dateObj = new Date();

  let year = dateObj.getFullYear();

  let month = dateObj.getMonth();
  month = ('0' + month).slice(-2);
  // To make sure the month always has 2-character-formate. For example, 1 => 01, 2 => 02

  let date = dateObj.getDate();
  date = ('0' + date).slice(-2);
  // To make sure the date always has 2-character-formate

  let hour = dateObj.getHours();
  hour = ('0' + hour).slice(-2);
  // To make sure the hour always has 2-character-formate

  let minute = dateObj.getMinutes();
  minute = ('0' + minute).slice(-2);
  // To make sure the minute always has 2-character-formate

  let second = dateObj.getSeconds();
  second = ('0' + second).slice(-2);
  // To make sure the second always has 2-character-formate

  const time = `${year}/${month}/${date} ${hour}:${minute}:${second}`;
  metadata[process.env.ENV_CONFIG] = process.env.ENV_CONFIG + '.' + time;
  fs.writeFile('src/data/buildVersion.json', JSON.stringify(metadata), function(err) {
    if (err) throw err;
    console.log(`Current build number: ${metadata[process.env.ENV_CONFIG]}`);
  })
})
