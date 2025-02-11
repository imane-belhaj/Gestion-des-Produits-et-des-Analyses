class User {
    constructor(userId,firstname,lastname,email,password,created_at,updated_at) {
        this.userId = userId;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }
}

module.exports = User;