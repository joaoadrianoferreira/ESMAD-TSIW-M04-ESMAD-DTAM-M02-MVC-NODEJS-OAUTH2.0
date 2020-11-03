const express = require("express"); 
const app = express(); 
const port = 3000;
const utilities = require('./utilities');

app.use(express.json())

app.get('/', function(req, res) {
    res.send(utilities.urlGoogle()); 
})

app.get('/login', function(req, res) {
    utilities.getTokens(req.query.code, (error, tokens) => {
        if(error) {
            res.status(400).send(error)
        } else {
            utilities.getUserInfo(tokens.access_token, (error, user_info) => {
                if(error) {
                    res.status(400).send(error);
                } else {
                    utilities.validateToken(tokens.id_token, (error, validToken) => {
                        if(error) {
                            res.status(400).send(error);
                        } else {
                            res.status(200).send({tokens: tokens, user: user_info, validToken: validToken})
                        }
                    });
                }
            })
        }
    })
})

app.listen(port, () => {
    console.log("a app esta a correr na porta " + port)
})