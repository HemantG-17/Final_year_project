const express = require('express');
const path = require('path');
const { spawn } = require('child_process');
const connect = require('./connection');

const customer = require('./routes/customer');
// const host = require('./routes/host')

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(customer);
// app.use(host)
connect();

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));
app.use(express.static('public'));

// 🔹 Run Python file on server start
const python = spawn('python', ['index.py']);  // use 'python3' if needed

python.stdout.on('data', (data) => {
    console.log(`Python Output: ${data.toString()}`);
});

python.stderr.on('data', (data) => {
    console.error(`Python Error: ${data.toString()}`);
});

python.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
});

app.listen(3000, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Server is running on port 3000");
    }
});
