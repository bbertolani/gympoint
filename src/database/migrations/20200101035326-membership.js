module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('membership', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            student_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'students', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: { model: 'plans', key: 'id' },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            price: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            start_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            end_date: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    down: queryInterface => {
        return queryInterface.dropTable('membership');
    },
};
