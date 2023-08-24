import fetch from 'node-fetch';

const getData = async (workerId) => {

    const CLIENT_ID_WARP = "";

    const genString = (strLen) => {
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < strLen; i++) {
            result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return result;
    };

    const digitString = (strLen) => {
        const digits = '0123456789';
        let result = '';
        for (let i = 0; i < strLen; i++) {
            result += digits.charAt(Math.floor(Math.random() * digits.length));
        }
        return result;
    };

    const URI = `https://api.cloudflareclient.com/v0a${digitString(3)}/reg`;

    while (true) {
        try {
            const install_id = genString(22);
            const body = {
                key: `${genString(43)}=`,
                install_id: install_id,
                fcm_token: `${install_id}:APA91b${genString(134)}`,
                referrer: CLIENT_ID_WARP,
                warp_enabled: false,
                tos: new Date().toISOString().slice(0, -5) + '+02:00',
                type: 'Android',
                locale: 'es_ES'
            };

            const response = await fetch(URI, {
                method: 'POST',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Host': 'api.cloudflareclient.com',
                    'Connection': 'Keep-Alive',
                    'Accept-Encoding': 'gzip',
                    'User-Agent': 'okhttp/3.12.1'
                }
            });

            const status = response.status;

            if (status === 200) {
                process.send({ type: 'incrementSuccess', workerId });
            } 

            const cooldownTime = Math.floor(Math.random() * 16) + 15;

            await new Promise((resolve) => {
                setTimeout(resolve, cooldownTime * 1000)
            });

        } catch (error) {
            console.error(error);
        }
    }
}

export default getData;