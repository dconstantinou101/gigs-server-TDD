//server.js
const app = require("./app")

const port = 3000;

app.listen(port, () => {
  console.log("Now listening on port", port);
});
