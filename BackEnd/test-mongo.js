import mongoose from 'mongoose';
import fs from 'fs';

const uri = "mongodb+srv://user1:4tYt0xgHlyFff25k@cluster001.g4qfwnk.mongodb.net/test?appName=Cluster001";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  fs.writeFileSync('mongo-result.txt', 'Successfully connected to MongoDB');
  console.log("Connected");
  process.exit(0);
})
.catch(err => {
  fs.writeFileSync('mongo-result.txt', 'Error: ' + err.toString());
  console.log("Error:", err);
  process.exit(1);
});
