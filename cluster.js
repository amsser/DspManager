var recluster = require('recluster'),
    path = require('path');

var cluster = recluster(path.join(__dirname, 'index.js'),{workers:3});
cluster.run();

process.on('SIGUSR2', function() {
    console.log('Got SIGUSR2, reloading cluster...');
    cluster.reload();
});

console.log("spawned cluster, kill -s SIGUSR2", process.pid, "to reload");