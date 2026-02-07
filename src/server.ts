import app from "./app.js";

console.log(">>> SERVER.TS CARICATO");

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
