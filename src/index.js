const axios = require('axios');

/**
 * Ping a website
 * @param website The website to ping
 * @param interval The interval per ping (in milli-seconds)
 * @param logging Enable logging
 * @param flipDM Flip the month/day to day/month in the log
 * @param noURLFix If you're pinging a non-http/https url, set this to true
 * @example
 * const pinger = require("@hystleria/pinger")
 * pinger.ping("kie.lol", 60000, true)
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


    setInterval(async () => {
        await axios.get(url, {
            headers: {
                'User-Agent': '@hystleria/pinger'
            },
        })
        .catch(e => console.log(`[🏓 @hystleria/pinger] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Failed to ping ${url}. Error: `, e));

        if (logging === true) {
            const d = new Date();
            console.log(`[🏓 @hystleria/pinger] [${dm(d.getMonth() + 1, d.getDate())} ${ps(d.getHours())}:${ps(d.getMinutes())}:${ps(d.getSeconds())}] Successfully pinged ${url} -> Ping #${count}`);
        };
        
        count++;
    }, interval);
}

module.exports = {ping};
