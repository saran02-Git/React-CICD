const express = require('express');
const app = express();
const port = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('Hello from Jenkins CI/CD Node app!');
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
