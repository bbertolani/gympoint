import Sequelize, { Model } from 'sequelize';

class HelpOrders extends Model {
    static init(sequelize) {
        super.init(
            {
                question: Sequelize.TEXT,
                answer: Sequelize.TEXT,
                answer_at: Sequelize.DATE,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(model) {
        this.belongsTo(model.Student, {
            foreignKey: 'student_id',
            as: 'student',
        });
    }
}

export default HelpOrders;
