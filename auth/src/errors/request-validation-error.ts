import { ValidationError } from 'express-validator'
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
    statusCode = 400;
    constructor(private errors: ValidationError[]) {
        super('Invalid request parameters')

        Object.setPrototypeOf(this, RequestValidationError.prototype)
    }

    serializeErrors () {
        return this.errors.map(error => {
            return {
                message: error.msg,
                field: error.type === 'field' ? error.path : ''
            }
        })
    }
}
