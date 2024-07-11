module.exports = {
    mongodb: {
        "uri" : "mongodb+srv://<username>:<password>@<host>/<database>?retryWrites=true&w=majority"
        // "url" : "mongodb://localhost/oracle"
    },
    session: {
        secret: '<session-secret>'
    },
    twitter: {
        consumerKey: '<consumer-key>',
        consumerSecret: '<consumer-secret>',
        callbackURL: 'https://oracleofchanges.herokuapp.com/twitter/callback'
        // callbackURL: 'http://127.0.0.1:3000/twitter/callback'
    }
}
