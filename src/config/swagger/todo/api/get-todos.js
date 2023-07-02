const todochema = require('../schema');
const name = "todo"

module.exports = {
    get:{
        tags: ['todos'],
        summary: "user get all todos",
        description: `Get ${name}`,
        operationId: `get ${name}`,
        parameters:[],
        responses:{
            '200':{
                description:`${name} were obtained`,
                content:{
                    'application/json':{
                        schema: todochema
                    }
                }
            }
        }
    }
}