const pinger = require('../index')
pinger.ping("discord.com", 2000, true);
pinger.webserver(8080)

const {Group} = require('../index');
let g = new Group();
['wubzy.xyz', 'k1e.io', 'git.wubzy.xyz'].forEach(u => g.add(u, 5000));
g.startAll();
