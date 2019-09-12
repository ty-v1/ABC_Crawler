const crawler = require('./src/crawler');
const definitions = require('./src/arguments').definitions;
const commandLineArgs = require('command-line-args');

async function run(options) {
    const languages = options['langs'];
    const outDir = options['out'];

    for (let i = 0; i < languages.length; i++) {
        const language = languages[i];

        if (options['all']) {
            await crawler.crawleAll(outDir, language);
        } else {
            await crawler.crawle(outDir, options['contest'], language);
        }
    }
}

//
// 引数をパースする
const options = commandLineArgs(definitions);
run(options).then(() => console.log('finish'));
