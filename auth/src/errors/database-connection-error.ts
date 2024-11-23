import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    statusCode = 500;
    private reason = 'Error connecting to database'
    constructor() {
        super('Error connection to database')

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }

    serializeErrors () {
        return [
            {
                message: this.reason
            }
        ]
    }
}