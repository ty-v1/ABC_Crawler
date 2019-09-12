const cheerio = require('cheerio');
const _ = require('lodash');

/**
 * 提出一覧ページからページ数を取得する
 * */
exports.getTotalPages = function (htmlDocument) {
    const $ = cheerio.load(htmlDocument);
    const ul = $('.pagination')[0];

    const pages = ul.children.filter(e => e.name === 'li')
        .map(li => li.children[0].children[0].data);

    return parseInt(_.last(pages));
};

/**
 * 提出一覧ページをパースしてIDを取得する
 * */
exports.parseSubmissionListPage = function (htmlDocument) {
    const $ = cheerio.load(htmlDocument);

    // 全ての行を取得する
    const trs = $('table tbody').find('tr');

    // リンク一覧を取得する
    const links = [];
    trs.each((i, tr) => {
        const tds = tr.children.filter(e => e.name === 'td');
        const tailTd = _.last(tds);

        if (_.isNil(tailTd)) {
            return;
        }

        const a = tailTd.children.find(e => e.name === 'a');
        if (_.isNil(a)) {
            return;
        }
        links.push(a.attribs['href'] || '');
    });

    // 空文字を削除してから返す
    return links.filter(e => !_.isEmpty(e));
};

/**
 * 提出ページを解析してソースコードを取得する
 * */
exports.parseSubmissionPage = function (htmlDocument) {
    const $ = cheerio.load(htmlDocument);
    const pres = $('#submission-code');
    const sourceCodes = [];

    pres.each((i, pre) => {
        const innerText = _.first(pre.children);
        if (_.isNil(innerText)) {
            return;
        }

        const sourceCode = innerText.data || '';
        sourceCodes.push(sourceCode);
    });

    // ゴミを消してから返す
    const sourceCode = _.first(sourceCodes);
    return sourceCode || '';
};
