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
        name: 'task',
        type: String,
        defaultValue: 'a'
    },
    {
        name: 'langs',
        defaultValue: ['Java'],
        type: String,
        multiple: true
    },
    {
        name: 'host',
        defaultValue: '127.0.0.1',
        type: String,
    },
    {
        name: 'port',
        defaultValue: 27017,
        type: String,
    },
    {
        name: 'db',
        type: String,
    },
    {
        name: 'username',
        type: String,
    },
    {
        name: 'password',
        type: String,
    },
];

