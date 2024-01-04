const axios = require('axios');

class Bot {
    constructor(token) {
        this.token = token
        this.url = `https://api.telegram.org`
    }

    async sendMessage(body, mcaAccount) {
        console.log('start sending message...');
        if (typeof body == "object") {
            const { chat_id, message_text } = body;
            const encodeText = encodeURIComponent(message_text)
            try {
                const response = await axios.get(`${this.url}/bot${this.token}/sendMessage?chat_id=${mcaAccount[0].id_telegram}&text=${encodeText}&parse_mode=html`);
                console.log(response.data);
                return response;
            } catch (error) {
                // console.log(error);
                if (error.response) {
                    // Request made and server responded
                    console.log('Error Data',error.response.data);
                    console.log('Error Status',error.response.status);
                    // console.log('Error Headers',error.response.headers);
                  } else if (error.request) {
                    // The request was made but no response was received
                    console.log('Error Request',error.request);
                  } else {
                    // Something happened in setting up the request that triggered an Error
                    // console.log('Error', error.message);
                  }
            }
        } else {
            console.log('error type');
        }
    }
}
module.exports = Bot;

// const newclass = new Bot("202473943:AAEfDTAViIvPb9HXpXYASl2TOqBoeSzS32Y");
// newclass.sendMessage(207853653, "tes")