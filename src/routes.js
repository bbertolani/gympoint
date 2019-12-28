import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import auth from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

routes.post('/students', StudentController.store);
routes.post('/sessions', SessionController.store);

routes.use(auth);

routes.put('/students', StudentController.update);

export default routes;
