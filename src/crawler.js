const fetcher = require('./fetcher');
const parser = require('./parser');
const writer = require('./writer');

async function crawleAll(options, task, language) {
    // 404が返ってくるまで行う
    let contest = 1;
    while (true) {
        try {
            await crawle(options, contest, task, language);
        } catch (error) {
            // 404の時のみ終了する
            if (error.name === 'StatusCodeError' && error.stausCode === 404) {
                return;
            }
            console.log(error);
            // エラーのときはもう一度
            continue;
        }
        contest++;
    }
}

async function crawle(options, contest, task, language) {
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
    await writeToDB(firstSubmissionListPage, options, contest, task, language);

    // 2ページ目以降をクロール
    for (let page = 2; page < totalPage; page++) {
        try {
            // エラーが起きても実行を続ける
            const submissionListPage
                = await fetcher.fetchSubmissionListPage(contest, task, language, page);
            await writeToDB(submissionListPage, options, contest, task, language);
        } catch (error) {
            // 404の時のみ終了する
            if (error.name === 'StatusCodeError' && error.stausCode === 404) {
                console.log('404 Error');
                return;
            }

            console.log(error);
            // エラーが出たら同じページをもう一回クロールする
            page--;
        }
    }
}

async function writeToDB(submissionListPage, options, contest, task, language) {
    const links = parser.parseSubmissionListPage(submissionListPage);
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const {id, text} = await fetcher.fetchSubmissionPage(link);
        const code = parser.parseSubmissionPage(text);
        const submission = {
            submissionId: Number.parseInt(id),
            contentId: contest,
            code,
            language,
            task: task.toUpperCase(),
        };

        await writer.writeSourceCode(options, submission);
    }
}

exports.crawleAll = crawleAll;
exports.crawle = crawle;
