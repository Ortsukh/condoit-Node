const mongoose = require ("mongoose");
const { PORT, MONGO_CONNECTION_STRING } = require('./common/config');

const app = require('./app');


const start = async () =>{
  try {
    await mongoose.connect(MONGO_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    app.listen(PORT, () =>
    console.log(`App is running on http://localhost:${PORT}`))
  }catch(e){
    console.log(e);
  }
}
// app.listen(PORT, () =>
//   console.log(`App is running on http://localhost:${PORT}`))
  start()