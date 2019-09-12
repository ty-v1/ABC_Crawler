exports.definitions = optionDefinitions = [
    {
        name: 'all',
        alias: 'a',
        type: Boolean,
        defaultValue: false
    },
    {
        name: 'contest',
        type: String,
        defaultValue: 1
    },
    {
        name: 'out',
        defaultValue: process.cwd(),
        type: String,
    },
    {
        name: 'langs',
        defaultValue: ['java8'],
        type: String,
        multiple: true
    }
];

