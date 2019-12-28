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
}

export default new StudentController();
