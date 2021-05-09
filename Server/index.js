var express = require('express');
var bodyParser = require('body-parser');
var uuid = require('uuid');
const aws_keys = require('./credentials'); //IMPORT DE CREDENCIALES DE AWS
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
//_____________________________________________________________
var app = express();
var port = process.env.PORT || 3525;
//_____________________________________________________________
var cors = require('cors');
var corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
//_____________________________________________________________
app.use((req, res, next) => {

    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Metodos de solicitud que deseas permitir
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');

    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Headers', '*');

    next();
})
//_____________________________________________________________
// Convierte una petición recibida (POST-GET...) a objeto JSON
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//_____________________________________________________________
//DIRECTORIO RAIZ
app.get('/', function (req, res) {
    res.status(200).send({
        message: 'Bienvenido, Servidor Proyecto1-Seminari1 Corriendo Correctamente...'
    });
});
//_____________________________________________________________
app.listen(port, function () {
    console.log(`Server running in http://localhost:${port}`);
    console.log('Defined routes:');
    console.log('	[GET] http://localhost:3525/');
});

// _____________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::::::::::::::    Instanciando SDK AWS    ::::::::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
var AWS = require('aws-sdk');
const s3 = new AWS.S3(aws_keys.s3);
const ddb = new AWS.DynamoDB(aws_keys.dynamodb);
const rek = new AWS.Rekognition(aws_keys.rekognition)
const translate = new AWS.Translate(aws_keys.translate);
const cognito = new AmazonCognitoIdentity.CognitoUserPool(aws_keys.cognito);

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::::: REGISTRO DE USUARIOS VIA COGNITO:::::::::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/registro", async (req, res) => {
    /** EJEMPLO DE JSON ESPERADO
     *  "username":"metalero123",
        "name":"Juan Perez",
        "email":"ronald.inge2013@gmail.com",
        "password":"12345678"
     */
    var attributelist = [];
    var dataname = {
        Name: 'name',
        Value: req.body.name,
    };
    var attributename = new AmazonCognitoIdentity.CognitoUserAttribute(dataname);
    attributelist.push(attributename);

    var dataemail = {
        Name: 'email',
        Value: req.body.email,
    };
    var attributeemail = new AmazonCognitoIdentity.CognitoUserAttribute(dataemail);
    attributelist.push(attributeemail);

    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    console.log(attributelist);

    cognito.signUp(req.body.username, hash + "D**", attributelist, null, async (err, data) => {

        if (err) {
            console.log(err);
            //res.json(err.message || err);
            res.json({ register: 'false' });
            return;
        }
        console.log(data);
        res.json({ register: 'true' });
        //res.json(req.body.username+' registrado');
    });
});

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::: REGISTRO DE USUARIOS PARA BASE DE DATOS DYNAMO :::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/registro2', (req, res) => {
    /* modelo de envio de datos json
    {
    "id_user":"100",
    "username":"metalero123",
    "nombre":"Juan Perez",
    "email":"ronald.inge2013@gmail.com",
    "password":"12345678"
    }
    */

    let body = req.body;
    // Usuario
    let id_user = uuid();
    let username = body.username;
    let nombre = body.nombre;
    let email = body.email;
    let password = body.password;

    // Guardando USUARIO
    ddb.putItem({
        TableName: "Usuario",
        Item: {
            "id_usuario": { S: id_user },
            "username": { S: username },
            "nombre": { S: nombre },
            "email": { S: email },
            "password": { S: password }
        }
    }, function (err, data) {
        if (err) {
            console.log('Error saving data:', err);
            res.send({ 'message': 'false' });
            // return;
        }
        else {
            console.log('Se registro el usuario: ', data);
            res.send({ 'message': 'true' });
            // return;
        }
    });
});

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::::::::: LOGIN DE USUARIOS COMPROBANDO COGNITO ::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post("/login", async (req, res) => {
    /* EJMPLO DE JSON ESPERADO
        "username":"metalero123",
        "password":"123456"
    */
    var crypto = require('crypto');
    var hash = crypto.createHash('sha256').update(req.body.password).digest('hex');
    var authenticationData = {
        Username: req.body.username,
        Password: hash + "D**"
    };
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
        authenticationData
    );
    var userData = {
        Username: req.body.username,
        Pool: cognito,
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            // User authentication was successful
            console.log(result);
            res.json({ autentication: 'true' });
        },
        onFailure: function (err) {
            // User authentication was not successful
            console.log(err);
            res.json({ autentication: 'false' });
        },
        mfaRequired: function (codeDeliveryDetails) {
            // MFA is required to complete user authentication.
            // Get the code from user and call
            cognitoUser.sendMFACode(verificationCode, this);
        },
    });
});

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::: LOGIN DE USUARIOS VERIFICADO POR BASE DE DATOS ::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/login2', (req, res) => {
    var user = req.body.username;
    var pass = req.body.password;

    const callback = result => {
        // console.log("Result: ", result);
        items_login = result.slice();
        console.log("Items: ", items_login);
        console.log("Length: ", items_login.length);

        if (items_login.length >= 1) {
            console.log('Datos correctos');
            res.json({ autentication: 'true' });
        }
        else {
            console.log('Datos incorrectos');
            res.json({ autentication: 'false' });
            //res.send({ 'message': 0 });
        }
    }
    scanLogin(user, pass, callback);
});

async function scanLogin(user, pass, callback) {
    try {
        var params = {
            TableName: 'Usuario',
            FilterExpression: "username = :usrn AND password = :contr OR email = :usrn AND password = :contr",

            ExpressionAttributeValues: {
                ":usrn": { "S": user },
                ":contr": { "S": pass }
            },
            // ProjectionExpression: 'username'  //Este es solo para obtener un dato en especifico
            // Limit: 10
        };
        var response = await ddb.scan(params).promise();
        itms = response.Items;
        callback(itms);
    }
    catch (error) {
        console.error(error);
    }
}

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// :::::::::::: CLASIFICACION DE BASURA CON REKOGNITION :::::::::::::::
// ::::::: IMPLEMENTADA CON AMAZON API GATEWAY:::::::::::::::::::::::::
// https://1x97up4hy9.execute-api.us-east-2.amazonaws.com/obtenerTags
app.post('/analizarBasura', function (req, res) {
    let base64String = req.body.foto.split(',').pop();;
    let imagen = base64String;
    var params = {
        Image:
        {
            Bytes: Buffer.from(imagen, 'base64')
        },
        MaxLabels: 15
    };
    rek.detectLabels(params, function (err, data) {
        if (err) {
            res.json({ mensaje: "Error" })
        }
        else {
            res.json({ texto: data.Labels });
            //tagss = data.Labels;
            //tags = JSON.stringify(tagss);
            //console.log("data.labels: ", tags);
        }
    });
});

// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::::::: SUBIR FOTO DE BASURA A LA CUENTA DEL USUARIO::::::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/subirFoto', (req, res) => {
    //EJEMPLO DE JSON ESPERADO
    /* {
        "username":"jjbbpp12",
        "foto":"archivo en base 64"
        }
    */
    let body = req.body;
    //Imagen
    let base64String = body.foto.split(',').pop();
    let extension = "jpg";
    // Usuario
    let username = body.username;
    //Decodificar imagen
    let encodedImage = base64String;
    let decodedImage = Buffer.from(encodedImage, 'base64');
    let filename = `${username}-${uuid()}.${extension}`; //uuid() genera un id unico para el archivo en s3
    // Obteniendo tags
    const params = {
        Image:
        {
            Bytes: Buffer.from(encodedImage, 'base64')
        },
        MaxLabels: 10
    }
    let tags;
    rek.detectLabels(params, function (err, data) {
        if (err) {
            // res.send({mensaje: "Error rekognition"})
            console.log(err, err.stack);
        }
        else {
            // res.send({labels: data.Labels});
            tags = data.Labels;
            tags = JSON.stringify(tags);
            console.log("data.labels: ", tags);
            //Parámetros para S3
            let bucketname = 'pyfinal-g37-imagenes';
            let folder = 'fotos-publicadas/';
            let filepath = `${folder}${filename}`;

            var uploadParamsS3 =
            {
                Bucket: bucketname,
                Key: filepath,
                Body: decodedImage,
                ACL: 'public-read',
            };

            s3.upload(uploadParamsS3, function sync(err, data) {
                if (err) {
                    console.log('Error uploading file:', err);
                    res.send({ 'message': 's3 failed' })
                }
                else {
                    console.log('Upload success at:', data.Location);
                    ddb.putItem({
                        TableName: "Imagen",
                        Item: {
                            "id_img": { S: uuid() },
                            "usuario": { S: username },
                            "url": { S: data.Location },
                            "tags": { S: tags }
                        }
                    }, function (err, data) {
                        if (err) {
                            console.log('Error saving data:', err);
                            res.send({ 'message': 'ddb failed' });
                        }
                        else {
                            console.log('Save success:', data);
                            res.send({ 'message': 'ddb success' });
                        }
                    });
                }
            });
        }
    });
});


// ____________________________________________________________________
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// ::::: TRADUCIR LA DESCRIPCION DE LA FOTO A VARIOS IDIOMAS:::::::::::
// ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
app.post('/traducirDescripcion', (req, res) => {
    /*JSON ESPERADO
        {
            "descripcion":"El vidrio es un material reciclable",
            "idioma":"en"
        }
        #####opciones de idiomas para mandar########
        -> en=ingles
        -> it=italiano
        -> pt=portugues
        -> de=aleman
        -> fr=frances
    */

    let descripcion = req.body.descripcion;
    let idioma_destino = req.body.idioma;

    let params = {
        SourceLanguageCode: 'auto',
        TargetLanguageCode: idioma_destino,
        Text: descripcion
    };

    translate.translateText(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
            res.send({ error: err })
        } else {
            console.log(data);
            res.send({ message: data })
        }
    });
});

