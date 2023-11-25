require("./db");
const app = require("./app");

const port = process.env.PORT || 3001 || 3002;

app.listen(port, () => {
  console.log(`listening on ${port} 👍👍`);
});
