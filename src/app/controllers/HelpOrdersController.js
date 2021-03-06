import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrders';
import Queue from '../../lib/Queue';
import QuestionMail from '../jobs/QuestionMail';

class HelpOrdersController {
    async storeOrder(req, res) {
        // Validate Input
        const schema = Yup.object().shape({
            question: Yup.string()
                .min(1)
                .required(),
        });
        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ msg: 'Invalid input data' });
        }

        const studentValidated = Yup.object().shape({
            id: Yup.number()
                .min(1)
                .required(),
        });
        if (!(await studentValidated.isValid(req.params))) {
            return res.status(400).json({ msg: 'Invalid input data' });
        }

        const student_id = req.params.id;
        const studentExist = await Student.findByPk(student_id);
        if (studentExist === null) {
            return res.status(400).json({ msg: 'Student not found' });
        }

        const { question } = req.body;

        const helpOrder = await HelpOrder.create({
            student_id,
            question,
        });

        await Queue.add(QuestionMail.key, { studentExist, question });

        return res.status(200).json({
            helpOrder,
        });
    }

    async listOrder(req, res) {
        const studentValidated = Yup.object().shape({
            id: Yup.number()
                .min(1)
                .required(),
        });
        if (!(await studentValidated.isValid(req.params))) {
            return res.status(400).json({ msg: 'Invalid input data' });
        }

        const helpOrder = await HelpOrder.findAll({
            where: { student_id: req.params.id },
        });
        if (helpOrder === null) {
            return res.status(200).json({ msg: 'not found' });
        }
        return res.status(200).json({
            helpOrder,
        });
    }

    async answer(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ msg: 'No data' });
        }

        // validate input id
        const { id } = req.params;
        const schema = Yup.object().shape({
            id: Yup.number().required(),
        });
        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        // validate input answer
        const arg = Yup.object().shape({
            answer: Yup.string()
                .min(1)
                .required(),
        });
        if (!(await arg.isValid(req.body))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        // find question
        const { answer } = req.body;
        const helpOrder = await HelpOrder.findOne({
            where: { id },
            include: [
                {
                    model: Student,
                    as: 'student',
                    attributes: ['name', 'email'],
                },
            ],
        });

        if (!helpOrder) {
            return res.status(400).json({ error: 'Question not found' });
        }

        await Queue.add(AnswerMail.key, { helpOrder, answer });

        const answer_at = new Date();
        await helpOrder.update({ answer, answer_at });

        return res.json({ helpOrder, msg: 'Your question was answer' });
    }
}

export default new HelpOrdersController();
