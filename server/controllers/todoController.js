const expressAsyncHandler = require('express-async-handler');
const Todo = require('../models/Todo');
const { connectDB } = require('../configs/database.conf');
const logger = require('../utils/Logger');

const AddTask = expressAsyncHandler(async (req, res) => {
    const { taskDetails, payload } = req.body;
    
    const db = await connectDB();
    const todoCollection = db.collection('todos');
    
    taskDetails.owner_id = payload.sub;

    const newTodo = new Todo(taskDetails);
    const addTodoResult = await todoCollection.insertOne(newTodo);
    if (!addTodoResult.acknowledged || !addTodoResult.insertedId) {
        logger.error('Failed to add task');
        res.status(500);
        throw new Error('Failed to add task');
    }

    res.status(201).send({message: 'Task added successfully'});
});

module.exports = {
    AddTask
};