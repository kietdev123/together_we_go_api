const todochema = require('../schema');

const name = "user"

module.exports = {
    get:{
        tags:['todos'],
        summary: "user get a todo",
        description: `Get a ${name}`,
        operationId: "getTodo",
        parameters:[
            {
                name:"id",
                in:"path",
                required:true,
                description: `A single ${name} id`
            }
        ],
        responses:{
            '200':{
                description:`$ is obtained`,
                content:{
                    'application/json':{
                        schema: todochema,
                    }
                }
            },
            '404':{
                description: `${name} is not found`,
                content:{
                    'application/json':{
                        schema:{
                            // $ref:'#/components/schemas/Error',
                            example:{
                                message:"We can't find the todo",
                                internal_code:"Invalid id"
                            }
                        }
                    }
                }
            }
        }
    }
}