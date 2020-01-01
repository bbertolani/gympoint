import * as Yup from 'yup';
import { addMonths } from 'date-fns';
import Plan from '../models/Plan';
import Student from '../models/Student';
import Membership from '../models/Membership';

class MembershipController {
    async store(req, res) {
        // Validate Input
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .min(1)
                .required(),
            plan_id: Yup.number()
                .min(1)
                .required(),
            price: Yup.number()
                .min(1)
                .required(),
            start_date: Yup.date().required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ msg: 'Invalid input data' });
        }

        const { student_id, plan_id, start_date } = req.body;

        // Validate User
        const studentExist = await Student.findByPk(student_id);
        if (studentExist === null) {
            return res.status(400).json({ msg: 'Student not found' });
        }

        // Validate Plan
        const planExist = await Plan.findByPk(plan_id);
        if (planExist === null) {
            return res.status(400).json({ msg: 'Plan not found' });
        }

        const planPrice = planExist.price * planExist.duration;

        // add months
        const end_date = addMonths(
            new Date(start_date),
            Number(planExist.duration)
        );

        const membership = await Membership.create({
            student_id,
            plan_id,
            price: planPrice,
            start_date,
            end_date,
        });

        return res.json({
            membership,
        });
    }

    async list(req, res) {
        const membership = await Membership.findAll();
        return res.json({
            membership,
        });
    }

    async update(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ msg: 'No data' });
        }
        const { id } = req.params;
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const arg = Yup.object().shape({
            student_id: Yup.number().min(1),
            plan_id: Yup.number().min(1),
            price: Yup.number().min(1),
            start_date: Yup.date(),
            end_date: Yup.date(),
        });

        if (!(await arg.isValid(req.body))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const membership = await Membership.findByPk(id);

        if (!membership) {
            return res.status(400).json({ error: 'Membership not found' });
        }

        await membership.update(req.body);

        return res.json({ membership, msg: 'Membership has been updated' });
    }

    async delete(req, res) {
        if (Object.keys(req.params).length === 0) {
            return res.status(400).json({ msg: 'No data' });
        }
        const { id } = req.params;
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const membership = await Membership.findByPk(id);

        if (!membership) {
            return res.status(400).json({ error: 'Membership not found' });
        }

        await membership.destroy(id);

        return res.json({ membership, msg: 'Membership has been delete' });
    }
}

export default new MembershipController();
