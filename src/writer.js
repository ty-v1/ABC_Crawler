const fs = require('fs');
const path = require('path');

/**
 * ソースコードを書き込む
 * */
exports.writeSourceCode = function (outDir, contestId, submissionId, langague, sourceCode) {
    const sourceCodeDir = path.join(outDir, contestId, langague);

    // ディレクトリがないときは同期的にディレクトリを作る
    if (!fs.existsSync(sourceCodeDir)) {
        fs.mkdirSync(sourceCodeDir, {recursive: true});
    }

    const sourceCodePath = path.join(sourceCodeDir, `${submissionId}.java`);
    const writer = fs.createWriteStream(sourceCodePath, 'utf8');
    writer.on('finish', () => {
        console.log(`Write source code to ${sourceCodePath}`);
        writer.close();
    });
    writer.on('error', function () {
        console.log(`Cannot write file ${sourceCodePath}`);
        writer.close();
    });
    writer.write(sourceCode);
};
