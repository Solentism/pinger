# @hystleria/pinger

A basic yet functional website pinger, you can use this to keep repl.it, Glitch or other similar project sites online 24/7!

[![NPM](https://nodei.co/npm/@hystleria/pinger)](https://npmjs.com/package/@hystleria/pinger/)

# Example Code (Interval = 30000)

```js
const pinger = require('@hystleria/pinger');
pinger.ping("https://kie.lol")
```
# Example Code (Interval = Custom)

```js
const pinger = require('@hystleria/pinger');
pinger.ping("https://kie.lol", 10000)
```

# Example Code (With Logging)

```js
const pinger = require('@hystleria/pinger');
pinger.ping("https://kie.lol", 30000, true)
```

# Example Code (Pinger Group)
Pinger Group allows you to ping several domains at the same time!

```js
const { Group } = require('@hystleria/pinger');
let groupPinger = new Group();

['wubzy.xyz', 'kie.lol', 'git.wubzy.xyz'].forEach(u => groupPinger.add(u, 5000));
groupPinger.startAll();
```
