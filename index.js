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

function logConfig(options) {
    console.log('=========================\n');

    console.log(`All: ${options['all']}`);
    console.log(`OutDir: ${options['out']}`);
    if (options['all']) {
        console.log(`Contest: ${options['contest']}`);
    }
    console.log(`Langs: ${options['langs']}`);

    console.log('=========================');
}

//
// 引数をパースする
const options = commandLineArgs(definitions);
logConfig(options);
run(options).then(() => console.log('finish'));
