const getTodo = require('./api/get-todo');
const getTodos = require('./api/get-todos');
const createTodo = require('./api/create-todo');
const updateTodo = require('./api/update-todo');
const deleteTodo = require('./api/delete-todo');

module.exports = {
    paths:{
        '/todos':{
            ...getTodos,
            ...createTodo
        },
        '/todos/{id}':{
            ...getTodo,
            ...updateTodo,
            ...deleteTodo
        }
    }
}