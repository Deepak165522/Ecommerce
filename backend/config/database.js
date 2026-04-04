const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then((data) => {
            console.log(`MongoDB Connected: ${data.connection.host}`);
        })
        .catch((err) => {
            console.log("DB Error:", err.message);
        });
}

module.exports = connectDatabase;