import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import PlanController from './app/controllers/PlanController';
import auth from './app/middlewares/auth';
import CheckinController from './app/controllers/CheckinController';
import MembershipController from './app/controllers/MembershipController';
import HelpOrdersController from './app/controllers/HelpOrdersController';

const routes = new Router();

routes.get('/', (req, res) => {
    return res.json({ message: 'Hello World' });
});

routes.post('/sessions', SessionController.store);
routes.post('/students/:id/checkin', CheckinController.store);
routes.get('/students/:id/checkin', CheckinController.list);

routes.use(auth);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/students/:id', StudentController.delete);
routes.get('/students', StudentController.list);

routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.list);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.post('/membership', MembershipController.store);
routes.get('/membership', MembershipController.list);
routes.put('/membership/:id', MembershipController.update);
routes.delete('/membership/:id', MembershipController.delete);

routes.post('/students/:id/help-orders', HelpOrdersController.storeOrder);
routes.get('/students/:id/help-orders', HelpOrdersController.listOrder);
routes.put('/help-orders/:id/answer', HelpOrdersController.answer);

export default routes;
