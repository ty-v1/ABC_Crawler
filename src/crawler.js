const fetcher = require('./fetcher');
const parser = require('./parser');
const writer = require('./writer');

exports.crawleAll = async function (outDir, language) {
    // 404が返ってくるまで行う
    try {
        let contest = 1;
        while (true) {
            await crawle(outDir, contest, language);
            contest++;
        }
    } catch (error) {
        console.error(error);
    }
};

exports.crawle = async function (outDir, contest, language) {
    const taskId = (contest < 20) ? '1' : 'a';

    let page = 1;
    // 1ページ目をクロール
    const firstSubmissionListPage
        = await fetcher.fetchSubmissionListPage(contest, taskId, language, page);
    const totalPage = parser.getTotalPages(firstSubmissionListPage);
    await writeToFile(firstSubmissionListPage, outDir, contest, language);

    // 2ページ目以降をクロール
    for (let page = 2; page < totalPage; page++) {
        const submissionListPage
            = await fetcher.fetchSubmissionListPage(contest, taskId, language, page);
        await writeToFile(submissionListPage, outDir, contest, language);
    }
};

async function writeToFile(submissionListPage, outDir, contest, language) {
    const links = parser.parseSubmissionListPage(submissionListPage);
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const {id, text} = await fetcher.fetchSubmissionPage(link);
        const code = parser.parseSubmissionPage(text);

        await writer.writeSourceCode(outDir, contest.toString(), id, language, code);
    }
}
