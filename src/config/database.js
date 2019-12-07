module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'students',
    define: {
        timestamp: true,
        underscored: true,
        underscoredAll: true,
    },
};
