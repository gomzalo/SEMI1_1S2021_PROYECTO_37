let aws_keys = {
    s3: {
        //apiVersion: '2006-03-01',
        region: 'us-east-2',
        accessKeyId: "AKIASKVPP37UDLPRJ3MS",
        secretAccessKey: "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"        
    },
    dynamodb: {
        apiVersion: '2012-08-10',
        region: 'us-east-2',
        accessKeyId: "AKIASKVPP37UEJNJHRUA",
        secretAccessKey: "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"
    },
    rekognition: {        
        region: 'us-east-2',
        accessKeyId: "AKIASKVPP37UCBXPBGPC",
        secretAccessKey: "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"        
    },
    translate:{
        region: 'us-east-2',
        accessKeyId: "AKIASKVPP37UCY75VAVJ",
        secretAccessKey: "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"        
    },
    cognito:{
        UserPoolId: 'us-east-2_3SKhmIeGg',
        ClientId: '3lvu99hpsqjg5fgfa4vtvkr313'
    }


}
module.exports = aws_keys