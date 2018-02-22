module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "jquery": true,
        "node": true
    },
    "extends": ["eslint:recommended"],
    'plugins': ['angular'],
    "parserOptions": {
        "sourceType": "module"
    },
    "rules": {
        "no-console": "warn",
        "no-unused-vars": "warn",
        "indent": [
            "error",
            4, {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};