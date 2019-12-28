import Student from '../models/Student';

class StudentController {
    async store(req, res) {
        const userExist = await Student.findOne({
            where: { email: req.body.email },
        });

        if (userExist) {
            return res.status(401).json({ error: 'User already exist' });
        }

        const student = await Student.create(req.body);
        return res.json(student);
    }

    async update(req, res) {
        const { email } = req.body;
        const newInfo = req.body.new;
        const {
            email: newEmail,
            name: newName,
            years: newYears,
            weight: newWeight,
            height: newHeight,
        } = newInfo;

        try {
            const user = await Student.findOne({
                where: { email },
            });

            if (email !== newEmail && newEmail !== undefined) {
                const userExist = await Student.findOne({
                    where: { email: newEmail },
                });
                if (userExist == null) {
                    user.update({ email: newEmail });
                } else {
                    return res
                        .status(401)
                        .json({ error: 'Email already used on another user' });
                }
            }

            if (newName !== user.name) {
                user.update({ name: newName });
            }

            if (newHeight !== user.height) {
                user.update({ height: newHeight });
            }

            if (newWeight !== user.weight) {
                user.update({ weight: newWeight });
            }

            if (newYears !== user.years) {
                user.update({ years: newYears });
            }

            return res.json({
                user,
            });
        } catch (err) {
            return res.status(401).json({ error: 'Student not found' });
        }
    }
}

export default new StudentController();
