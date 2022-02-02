const axios = require('axios');

/**
 * Ping a website
 * @param website The website to ping
 * @param interval The interval per ping (in milli-seconds)
 * @example
 * const pinger = require("@hystleria/pinger")
 * pinger.ping("kie.lol", 60000, true)
 */

const ping = async function (url, interval, logging) {
    let count = 1;
    
    if (!interval) interval = 30000;
    if (!url) return console.log(`[🏓 @hystleria/pinger] You must specify a URL.`);

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

    if (URLValidity(url) !== true || encodeURIComponent(url).includes("%3C" || "%3E" || "%20")) return console.log(`[🏓 @hystleria/pinger] You must specify a valid URL.`);

    setInterval(async () => {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': '@hystleria/pinger'
            },
        })

        if (logging === true) {
            const d = new Date();
            console.log(`[🏓 @hystleria/pinger] [${d.getMonth()}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}] Successfully pinged ${url} -> Ping#${count}`);
        };
        
        count++;
    }, interval);
}

module.exports = {ping};
