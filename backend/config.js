module.exports = {
    dbURL: "mongodb://localhost/zns",
    passwordHashCost: 10,
    serverPort: 3001,
    maxTaskPartners: 2,
    skillAuthorizations: {0: [0], 1: [2,3], 2: [-1], 3: [1, 4, -3]}
};