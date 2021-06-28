const Validator = require('jsonschema').Validator;


class UserModel {

    constructor() {
        this.validator = new Validator;
        this.isUser = this.isUser.bind(this);
    }

    schema = {
        'type': 'object',
        'properties': {
            'firstName': {
                'type': 'string'
            },
            'lastName': {
                'type': 'string'
            },
            'username': {
                'type': 'string'
            },
            'password': {
                'type': 'string',
            }
        },
        'required': ['firstName', 'lastName', 'username', 'password']
    };

    isUser(obj) {
        return this.validator.validate(obj, this.schema, { throwError: true });
    }
}

module.exports = new UserModel;