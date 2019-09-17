const fetcher = require('./fetcher');
const parser = require('./parser');
const writer = require('./writer');

async function crawleAll(outDir, task, language) {
    // 404が返ってくるまで行う
    try {
        let contest = 1;
        while (true) {
            try {
                await crawle(outDir, contest, task, language);
            } catch (error) {
                // 404の時のみ終了する
                if (error.name === 'StatusCodeError' && error.stausCode === 404) {
                    return;
                }
                console.log(error)
            }
            contest++;
        }
    } catch (error) {
        console.error(error);
    }
}

async function crawle(outDir, contest, task, language) {
    // 125回以前はe問題とf問題はない
    if (contest <= 125) {
        switch (task) {
            case 'e':
            case 'f':
                return;
        }
    }

    let page = 1;
    // 1ページ目をクロール
    const firstSubmissionListPage
        = await fetcher.fetchSubmissionListPage(contest, task, language, page);
    const totalPage = parser.getTotalPages(firstSubmissionListPage);
    await writeToFile(firstSubmissionListPage, outDir, contest, task, language);

    // 2ページ目以降をクロール
    for (let page = 2; page < totalPage; page++) {
        try {
            // エラーが起きても実行を続ける
            const submissionListPage
                = await fetcher.fetchSubmissionListPage(contest, task, language, page);
            await writeToFile(submissionListPage, outDir, contest, task, language);
        } catch (error) {
            console.log(error)
        }
    }
}

async function writeToFile(submissionListPage, outDir, contest, task, language) {
    const links = parser.parseSubmissionListPage(submissionListPage);
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const {id, text} = await fetcher.fetchSubmissionPage(link);
        const code = parser.parseSubmissionPage(text);

        await writer.writeSourceCode(outDir, contest.toString(), id, task, language, code);
    }
}

exports.crawleAll = crawleAll;
exports.crawle = crawle;
