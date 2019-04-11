const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());

async function handler(req, resp) {
  const url = req.query.u;
  try {
    const r = await fetch(url, {
      headers: { Authorization: req.headers.authorization },
    });
    if (await r.ok) {
      const d = await r.json();
      resp.send(d);
      return;
    } else {
      console.error(r);
      resp.sendStatus(400);
      return;
    }
  } catch (err) {
    console.error(err);
    resp.sendStatus(500);
  }
}

app.get("/", handler);
app.post("/", handler);

app.listen(3000);
