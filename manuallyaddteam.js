const connectDB = require('./config/db.js');
const Team = require('./models/Team.js');
const teams = require('./teamsdet.js');
const dotenv = require('dotenv');
const colors = require('colors');

dotenv.config({path : './config/.env'})
connectDB()

const importData = async() => {
    try {
        await Team.deleteMany();
        const sampleTeams = teams.map(team => ({ ...team }))
        await Team.insertMany(sampleTeams);

        console.log(`Data Imported`)
        process.exit()
    } catch (error) {
        console.error(`${error}`);
        process.exit(1)
    }
}

const deleteData = async () => {
    try {
        await Team.deleteMany();

        console.log(`Data Destroyed`)
        process.exit()
    } catch (error) {
        console.error(`${error}`);
        process.exit(1)
    }
}

if(process.argv[2] === '-d'){
    deleteData()
}else{
    importData()
}