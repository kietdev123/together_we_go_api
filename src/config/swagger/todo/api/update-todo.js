const todochema = require('../schema');
const name ="user";
module.exports = {
    put:{
        tags:['todos'],
        summary: "user update a todo",
        description: `Update ${name}`,
        operationId: `update ${name}`,
        cosumes : [
            'application/json'
        ],
        parameters:[
            {
                in:"path",
                name:"id",               
                required:true,
                description: `Id of ${name} to be updated`
            },
        ],
        requestBody : {
            content : {
                "application/json": {
                    schema : todochema,
                }
            }
        },
        responses:{
            '200':{
                description: `${name} updated successfully`
            },
            '404':{
                description: `${name} not found`
            },
            '500':{
                description: "Server error"
            }        
        }
    }
}