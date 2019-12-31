import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
    async list(req, res) {
        const student = await Student.findAll();

        if (student.length === 0) {
            return res.status(400).json({ msg: 'No users available' });
        }

        return res.json(student);
    }

    async store(req, res) {
        const schema = Yup.object().shape({
            name: Yup.string()
                .min(8)
                .required(),
            years: Yup.number()
                .min(2)
                .required(),
            email: Yup.string()
                .email()
                .required(),
            height: Yup.number()
                .min(2)
                .required(),
            weight: Yup.number()
                .min(2)
                .required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const userExist = await Student.findOne({
            where: { email: req.body.email },
        });

        if (userExist) {
            return res.status(400).json({ error: 'User already exist' });
        }

        const student = await Student.create(req.body);
        return res.json(student);
    }

    async update(req, res) {
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ msg: 'No data' });
        }

        const { id } = req.params;
        const params = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await params.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const arg = Yup.object().shape({
            name: Yup.string().min(8),
            years: Yup.number().min(2),
            email: Yup.string().email(),
            height: Yup.number().min(2),
            weight: Yup.number().min(2),
        });

        if (!(await arg.isValid(req.body))) {
            return res.status(400).json({
                msg: 'Invalid arguments',
            });
        }

        const { email: newEmail, name: newName } = req.body;

        const student = await Student.findByPk(id);
        if (student === null) {
            return res.status(400).json({ error: 'User not found' });
        }
        const { email, name } = student;

        if (newEmail) {
            const searchEmail = await Student.findOne({
                where: { email: newEmail },
            });
            if (searchEmail) {
                return res.status(400).json({ error: 'Email already in use' });
            }
        }

        if (newName) {
            const searchName = await student.findOne({
                where: { name: newName },
            });
            if (searchName) {
                return res.status(400).json({ error: 'Name already in use' });
            }
        }

        student.update(req.body);

        return res.json({
            student,
        });
    }

    async delete(req, res) {
        const { id } = req.params;
        const params = Yup.object().shape({
            id: Yup.number().required(),
        });

        if (!(await params.isValid(req.params))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const student = await Student.findByPk(id);
        if (student === null) {
            return res.status(400).json({ msg: 'User not found' });
        }
        const { email, name } = student;

        student.destroy({ where: { id } });

        return res.json({
            email,
            name,
            msg: 'User deleted',
        });
    }
}

export default new StudentController();
