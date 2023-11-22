const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(`mongodb+srv://rokayaabdelgwad246:tMkfEJQHU9p0NdI8@cluster0.lothajd.mongodb.net/`);
  console.log("connected to database successfully ✅✅✅✅");
}

main().catch((err) => console.log(err));

