class HttpException extends Error {
  constructor(success, status, message) {
    super(message);
    this.success = success;
    this.status = status;
    this.message = message;
  }
}

module.exports = HttpException;
