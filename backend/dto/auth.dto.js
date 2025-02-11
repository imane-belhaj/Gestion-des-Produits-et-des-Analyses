class RegisterDTO {
    constructor(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
}

class LoginDTO {
    constructor(email, password) {
        this.email = email;
        this.password = password;
    }
}

module.exports = {RegisterDTO, LoginDTO};
