import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
    async store(req, res) {
        const schema = Yup.object().shape({
            title: Yup.string().required(),
            duration: Yup.number().required(),
            price: Yup.number().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const { title, duration, price } = req.body;
        const planExist = await Plan.findOne({
            where: [{ title }, { duration }, { price }],
        });

        if (planExist) {
            return res.status(400).json({ error: 'Plan alredy exist' });
        }
        const plan = await Plan.create(req.body);

        return res.json({
            plan,
        });
    }

    async list(req, res) {
        const plans = await Plan.findAll();

        if (plans.length === 0) {
            return res.status(400).json({ msg: 'No plans' });
        }

        return res.json(plans);
    }

    async delete(req, res) {
        const { id } = req.params;
        const schema = Yup.object().shape({
            id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const planExist = await Plan.findByPk(id);

        if (!planExist) {
            return res.status(400).json({ error: 'Plan not found' });
        }

        await Plan.destroy({
            where: { id },
        });

        const { title } = planExist;

        return res.json({ id, title, msg: 'Plan has been deleted' });
    }

    async update(req, res) {
        const { id } = req.params;
        const schema = Yup.object().shape({
            id: Yup.string().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const planExist = await Plan.findByPk(id);

        if (!planExist) {
            return res.status(400).json({ error: 'Plan not found' });
        }

        await planExist.update(req.body);

        return res.json({ planExist, msg: 'Plan has been updated' });
    }
}

export default new PlanController();
