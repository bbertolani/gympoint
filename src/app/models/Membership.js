import Sequelize, { Model } from 'sequelize';

class Membership extends Model {
    static init(sequelize) {
        super.init(
            {
                student_id: Sequelize.NUMBER,
                plan_id: Sequelize.NUMBER,
                price: Sequelize.NUMBER,
                start_date: Sequelize.DATE,
                end_date: Sequelize.DATE,
            },
            {
                sequelize,
                tableName: 'membership',
            }
        );
        return this;
    }

    static associate(model) {
        this.belongsTo(model.User, {
            foreignKey: 'id',
        });
        this.belongsTo(model.Plan, {
            foreignKey: 'id',
        });
    }
}

export default Membership;
