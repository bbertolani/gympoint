import jwt from 'jsonwebtoken';
import User from '../models/User';

class SessionController {
    async store(req, res) {
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
            token: jwt.sign({ id }, '2ccc150b9c1c33c3ce116dec447adbd8', {
                expiresIn: '7d',
            }),
        });
    }
}

export default new SessionController();
