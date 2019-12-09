import { Router } from 'express';
import Student from './app/models/Student';

import StudentController from './app/controllers/StudentController';

const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

routes.post('/students', StudentController.store);

export default routes;
