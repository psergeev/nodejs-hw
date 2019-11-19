export function task1() {
  process.stdin.setEncoding('utf8');

  process.stdin.on('data', inputString => {
    process.stdout.write(
      inputString
        .slice(0, -1)
        .split('')
        .reverse()
        .join('') + '\n\n',
    );
  });
}

export function task2() {
  const fs = require('fs');
  const csvtojson = require('csvtojson');
  const { pipeline } = require('stream');

  let readStream = fs.createReadStream('./csv/node_mentoring_t1_2_input.csv');
  let writeStream = fs.createWriteStream('./csv/node_mentoring_t1_2_output.txt');

  pipeline(readStream, csvtojson(), writeStream, err => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  });
}
