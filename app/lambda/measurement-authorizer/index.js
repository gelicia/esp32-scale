exports.handler = async(event) => {
    let response = {
        "isAuthorized": false
    };
    
    if (event.headers.authorization === "<key>") {
        response = {
            "isAuthorized": true
        };
    }

    return response;

};
