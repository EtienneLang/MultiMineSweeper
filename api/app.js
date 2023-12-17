const express = require('express');

const app = express();

const port = 3000;

// code …

app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}`)
  })