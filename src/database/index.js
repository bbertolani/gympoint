import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Plan from '../app/models/Plan';
import Student from '../app/models/Student';
import Checkin from '../app/models/Checkin';
import Membership from '../app/models/Membership';
import HelpOrders from '../app/models/HelpOrders';

const models = [Student, User, Plan, Checkin, Membership, HelpOrders];

class Database {
    constructor() {
        this.init();
    }

    init() {
        this.connection = new Sequelize(databaseConfig);

        models
            .map(model => model.init(this.connection))
            .map(
                model =>
                    model.associate && model.associate(this.connection.models)
            );
    }
}

export default new Database();
