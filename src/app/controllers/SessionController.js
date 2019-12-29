import jwt from 'jsonwebtoken';
import * as Yup from 'yup';
import User from '../models/User';
import authMiddleware from '../../config/auth';

class SessionController {
    async store(req, res) {
        const schema = Yup.object().shape({
            email: Yup.string()
                .email()
                .required(),
            password: Yup.string().required(),
        });

        if (!(await schema.isValid(req.body))) {
            return res.status(400).json({ error: 'Input is not valid' });
        }

        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User or password wrong' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json({ error: 'User or password wrong' });
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: jwt.sign({ id }, authMiddleware.secret, {
                expiresIn: authMiddleware.expiresIn,
            }),
        });
    }
}

export default new SessionController();