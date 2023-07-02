// const todochema = require('../schema');
const name = 'user';

module.exports = {
    delete:{
        tags: ['todos'],
        summary: "user delete a todo",
        description: `Deleting a ${name}`,
        operationId: `delete ${name}`,
        parameters:[
            {
                name:"id",
                in:"path",
                required:true,
                description: `Deleting a ${name}`
            }
        ],
        responses:{
            '200':{
                description:`${name} deleted successfully`
            },
            '404':{
                description:`${name} not found`
            },
            '500':{
                description:"Server error"
            }
        }
    }
}