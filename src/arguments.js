exports.definitions = optionDefinitions = [
    {
        name: 'all',
        type: Boolean
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

