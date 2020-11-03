const { google } = require('googleapis');

const googleConfig = {
    clientId: '829313020638-tikb0uqdo4uev1okfmji5ajbsegg3mt4.apps.googleusercontent.com',
    clientSecret: 'OFgE5UUNz-ZUE05SZqhQ4bfP',
    redirect: 'http://localhost:3000/login'
};

const defaultScope = [
    'https://www.googleapis.com/auth/userinfo.profile', 
    'https://www.googleapis.com/auth/userinfo.email'
];

const createConnection = () => {
  return new google.auth.OAuth2(
    googleConfig.clientId,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
}

const getConnectionUrl = (auth) => {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}

const urlGoogle = () => {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

const getTokens = (code, callback) => {
    const auth = createConnection();
    auth.getToken(code).then(tokens => {
        if (!tokens.tokens) {
            return callback(true, "Error")
        } else {
            return callback(false, tokens.tokens)
        }
    })
}

const getUserInfo = (access_token, callback) => {
    let client = new google.auth.OAuth2(googleConfig.clientId);
    client.setCredentials({access_token: access_token});
    var oauth2 = google.oauth2({
        auth: client,
        version: 'v2'
    });
    oauth2.userinfo.get(
    function(err, result) {
        if (err) {
            return callback(true, err)
        } else {
            return callback(false, result.data)
        }
    });
}

const validateToken = (token, callback) => {
    let client = new google.auth.OAuth2(googleConfig.clientId);
    async function verify() {
        let ticket = await client.verifyIdToken({
            idToken: token,
            audience: googleConfig.clientId, 
        });
        
        let payload = ticket.getPayload();
        return callback(false,payload);
    }
        
    verify().catch(error => {
        return callback(true, error);
    });
}

exports.createConnection = createConnection; 
exports.generateAuthUrl = getConnectionUrl; 
exports.urlGoogle = urlGoogle; 
exports.getTokens = getTokens; 
exports.getUserInfo = getUserInfo; 
exports.validateToken = validateToken; 

