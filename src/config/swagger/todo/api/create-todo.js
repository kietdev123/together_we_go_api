const todochema = require('../schema');
const name = 'user';

module.exports = {
    post:{
        tags:['todos'],
        summary: "user create a new todo",
        description: `Create ${name}`,
        operationId: `create ${name}`,
        // requestBody: {
        //     content: [
        //         {
        //             "application/json":
        //                 schema:
        //                     $ref: '#/components/schemas/Pet',
        //         },
               
        //         "application/xml":
        //             schema:
        //                 $ref: '#/components/schemas/Pet',
        //         application/x-www-form-urlencoded:
        //             schema:
        //                 $ref: '#/components/schemas/Pet',
        //     ],  
        //     required: true       
        // },
        responses:{
            '201':{
                description: `${name} created successfully`
            },
            '500':{
                description: 'Server error'
            }
        }
    }
}