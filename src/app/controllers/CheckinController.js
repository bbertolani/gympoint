import * as Yup from 'yup';
import { startOfDay, endOfDay, subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
    async store(req, res) {
        // Validate Input
        const schema = Yup.object().shape({
            student_id: Yup.number()
                .min(1)
                .required(),
        });
        if (!(await schema.isValid(req.params))) {
            return res.status(400).json({ msg: 'Student ID not provided' });
        }

        // Validate User
        const studentExist = await Student.findByPk(req.params.id);
        if (studentExist === null) {
            return res.status(400).json({ msg: 'Student not found' });
        }

        // Checked Today
        const today = new Date();
        const checkedToday = await Checkin.findAll({
            where: {
                student_id: req.params.id,
                createdAt: {
                    [Op.between]: [startOfDay(today), endOfDay(today)],
                },
            },
        });
        if (checkedToday.length > 0) {
            return res
                .status(200)
                .json({ msg: 'Student already checked today' });
        }

        // Last 7 days checked
        const checkedLastDays = await Checkin.findAll({
            where: {
                student_id: req.params.id,
                createdAt: { [Op.between]: [subDays(today, 7), today] },
            },
        });
        if (checkedLastDays.length > 4) {
            return res
                .status(200)
                .json({ msg: 'Limit of 5 checkin in the last 7 days' });
        }

        // Insert into database
        const checkin = await Checkin.create({ student_id: req.params.id });

        return res.json({
            checkin,
        });
    }

    async list(req, res) {
        const schema = Yup.object().shape({
            id: Yup.number()
                .min(1)
                .required(),
        });
        if (!schema.isValid(req.params)) {
            return res.status(400).json({ msg: 'Student ID not provided' });
        }

        const checkin = await Checkin.findAll({
            where: { student_id: req.params.id },
        });

        if (checkin.length === 0) {
            return res.status(200).json({ msg: 'Student has not checkin yet' });
        }

        return res.json(checkin);
    }
}

export default new CheckinController();
