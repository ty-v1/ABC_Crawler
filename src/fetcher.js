const request = require('request-promise');

function formatter(value) {
    return ('000' + value).slice(-3);
}

function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), time);
    });
}

const languages = {
    'java7': 3015,
    'java8': 3016,
};

const taskMap = {
    a: '1',
    b: '2',
    c: '3',
    d: '4',
    e: '5',
    f: '6'
};

/**
 * 提出一覧ページを取得する
 * */
exports.fetchSubmissionListPage = async function (contestId, task, language, page) {
    await sleep(1500);

    const taskId = (contestId < 20) ? taskMap[task] : task;
    const contestName = `abc${formatter(contestId)}`;
    const taskName = `${contestName}_${taskId}`;
    const option = {
        url: `https://atcoder.jp/contests/${contestName}/submissions`,
        qs: {
            'f.Task': taskName,
            'f.LanguageName': languages[language],
            'f.Status': 'AC',
            page
        }
    };
    return await request(option);
};

/**
 * 提出ページを取得する
 * */
exports.fetchSubmissionPage = async function (path) {
    await sleep(1500);

    const option = {
        url: `https://atcoder.jp${path}`
    };
    const text = await request(option);
    const id = (/\/\d+/.exec(path))[0].replace('/', '');
    return {
        text,
        id
    };
};
