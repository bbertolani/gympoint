import Sequelize, { Model } from 'sequelize';

class Checkin extends Model {
    static init(sequelize) {
        super.init(
            {
                student_id: Sequelize.NUMBER,
            },
            {
                sequelize,
            }
        );
        return this;
    }

    static associate(model) {
        return this.belongsTo(model.User, { foreignKey: 'id' });
    }
}

export default Checkin;
