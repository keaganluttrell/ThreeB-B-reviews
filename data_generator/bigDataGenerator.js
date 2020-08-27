const fs = require('fs');
const { roomReviewGenerator } = require('./roomReviewGenerator');

let failed = false;
const writeable = fs.createWriteStream('./bigDataSet.json');
writeable.on('error', (err) => {
  failed = true;
  console.log(err);
});

module.exports.bigDataGenerator = async (times) => {
  writeable.write('{')
  for(let i = 0; i < times; i++) {
    if (failed) {
      break;
    }

    if (i % 100000 === 0) {
      console.log(`Completed ${i} records.`);
    }

    let hasSpace = writeable.write(`\n"${i}":${JSON.stringify(roomReviewGenerator(i))},`);
    if (!hasSpace) {
      await new Promise((resolve, reject) => writeable.once('drain', resolve));
    }
  }

  writeable.write('\n}');
  writeable.end();
  console.log(`Generated ${times} records.`)
};

module.exports.bigDataGenerator(100);