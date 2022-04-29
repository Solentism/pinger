const axios = require('axios');
const express = require('express');

const app = express();
app.use(express.static("public"));

/**
 * Copyright (c) 2022, Kieran Schuler (hystleria // kieran@k1e.io)
 *
 * https://github.com/hystleria/pinger
 * 
 * This code is subject to the BSD 3-Clause "New" or "Revised" License authored by Regents of the University of California.
 * Information about this license can be found in the LICENSE.md file.
 
 
 * Ping a website
 * @param website The website to ping
 * @param interval The interval per ping (in milli-seconds)
 * @param logging Enable logging
 * @param flipDM Flip the month/day to day/month in the log
 * @param noURLFix If you're pinging a non-http/https url, set this to true
 * @example
 * const pinger = require("@hystleria/pinger")
 * pinger.ping("k1e.io", 60000, true)
 */

const ping = async function (url, interval, logging=true, flipDM=false, noURLFix=false) {
    let count = 1;
    
    if (!interval) interval = 30000;
    if (!url) return console.log(`[🏓 @hystleria/pinger] You must specify a URL.`);

    if (!url.startsWith('http://') && !url.startsWith('https://') && !noURLFix) {url = `https://${url}`;}

    if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
        return console.log(`[🏓 @hystleria/pinger] You must specify a valid URL.`);
    }

    if (logging == true){
        console.log(`[🏓 @hystleria/pinger] Currently logging pings for ${url} with the interval ${interval}.`);
    }

    function URLValidity(string) {
        try {
            new URL(string);
        } catch {
            return false;
        }

        return true;
    }

    const ps = t=>`${t}`.padStart(2, '0');
    const dm = (m,d)=>flipDM?`${ps(d)}/${ps(m)}`:`${ps(m)}/${ps(d)}`;


    return setInterval(async () => {
        const d = new Date();
        await axios.get(url, {
            headers: {
                'User-Agent': '@hystleria/pingerV2'
            },
        })
        .catch(e => console.log(`[🏓 @hystleria/pinger] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e));

        if (logging === true) {
            console.log(`[🏓 @hystleria/pinger] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged ${url} -> Ping #${count}`);
        };
        
        count++;
    }, interval);
}

const webserver = async function (port, flipDM=false) {
    
    app.get('*', (req, res) => {
        res.json('[🏓 @hystleria/pinger] Actively listening for requests. If logging is enabled, check your terminal.')
    });
    
    const listener = app.listen(port, () => {
        const d = new Date();

        const ps = t=>`${t}`.padStart(2, '0');
        const dm = (m,d)=>flipDM?`${ps(d)}/${ps(m)}`:`${ps(m)}/${ps(d)}`;

        console.log(`[🏓 @hystleria/pinger] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Webserver listening on port ${port}`);
    });
}
class Group {
    name;
    pingers = new Map();

    constructor(name="Pinger Group") {
        this.name = name;
    }

    startAll() {
        this.pingers.forEach(ping => {if (!ping.started) {ping.start();}});
    };

    add(url, interval, logging=true, flipDM=false, noURLFix=false) {
        const id = this.pingers.size + 1;
        let ping = {
            name: null,
            id,
            config: {url, interval, logging, flipDM, noURLFix},
            ping: async function(url, interval, logging=true, flipDM=false, noURLFix=false) {
                let count = 1;
                const pf = `[🏓 @hystleria/pinger] [${this.name}] [${this.id}]`;
                
                if (!interval) interval = 30000;
                if (!url) return console.log(`${pf} You must specify a URL.`);
            
                if (!url.startsWith('http://') && !url.startsWith('https://') && !noURLFix) {url = `https://${url}`;}
            
                if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) {
                    return console.log(`${pf} You must specify a valid URL.`);
                }
            
                if (logging == true) {
                    console.log(`${pf} Currently logging pings for ${url} with the interval ${interval}.`);
                }
            
                function URLValidity(string) {
                    try {
                        new URL(string);
                    } catch {
                        return false;
                    }
            
                    return true;
                }
            
                const ps = t=>`${t}`.padStart(2, '0');
                const dm = (m,d)=>flipDM?`${ps(d)}/${ps(m)}`:`${ps(m)}/${ps(d)}`;
            
            
                return setInterval(async () => {
                    await axios.get(url, {
                        headers: {
                            'User-Agent': '@hystleria/pinger'
                        },
                    })
                    .catch(e => {
                        const d = new Date();
                        console.log(`${pf} [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e);
                    });
            
                    if (logging === true) {
                        const d = new Date();
                        console.log(`${pf} [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged ${url} -> Ping #${count}`);
                    };
                    
                    count++;
                }, interval);
            },
            interval: null,
            stop: null,
            started: false,
            start: null
        };
        ping.name = this.name;
        ping.start = () => {
            const tp = ping.ping(ping.config.url, ping.config.interval, ping.config.logging, ping.config.flipDM, ping.config.noURLFix);
            if (!tp) {return;}
            ping.interval = tp;
            ping.stop = () => {
                clearInterval(ping.interval);
                if (ping.config.logging) {console.log();}
            }
            ping.started = true;
        };

        console.log(`[🏓 @hystleria/pinger] [${ping.name}] Added pinger for ${ping.config.url} into group.`);

        this.pingers.set(id, ping);
        return ping;
    };

    addStart(url, interval, logging=true, flipDM=false, noURLFix=false) {
        this.add(url, interval, logging, flipDM, noURLFix).start();
    };

    stop(id=undefined) {
        if (id) {if (this.pingers.has(id) && this.pingers.get(id).started) {this.pingers.get(id).stop();}}
        else {
            this.pingers.forEach(ping => {if (ping.started) {ping.stop();}});
        }
    };
};

module.exports = {ping, Group, webserver};
