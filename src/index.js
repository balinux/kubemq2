// import { EventsClient, Utils, Config } from '../../../src';
require('dotenv').config();

const { EventsClient, Utils, Config } = require('kubemq-js')

const Bot = require('./serevices/telegram_bot/bot');

const { getMcaAccount } = require('./serevices/mca/mca_service')



/**
 * setup telegram bot
 *
 */
const bot = new Bot(process.env.TOKEN_BOT)

async function main() {
  const opts = {
    // address: '172.16.121.26:50000',
    address: `${process.env.KUBEMQHOST}:${process.env.KUBEMQPORT}`,
    clientId: process.env.CLIENTID,
  };
  const eventsClient = new EventsClient(opts);
  const subRequest = {
    channel: process.env.CHANNELNAME,
  };
  await eventsClient
    .subscribe(subRequest, async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }
      if (msg) {
        // console.log(msg);

        /** @type {*} 
         * move to string from byte
        */
        const decoder = new TextDecoder();
        const string = decoder.decode(msg.body);
        const stringToObject = JSON.parse(string)

        console.log('change string to object', stringToObject);

        /** @type {*}
         * variabel untuk mengambil data mca
         */
        const mcaAccount = await getMcaAccount(stringToObject.id_sso);

        console.log('get mca account', mcaAccount)

        /**
         * send menssage to telegram bot
         * you can send message to another platform here
         */
        if (mcaAccount.length != null && mcaAccount.length >= 1) {
          console.log('sending message to telegram');
          bot.sendMessage(stringToObject, mcaAccount);
        } else {
          console.log('MCA account not found');
        }


      }
    })
    .catch((reason) => {
      console.log(reason);
    });

  // create delay for 1 second
  await new Promise((r) => setTimeout(r, 1000));

  const sender = eventsClient
    .stream((err, result) => {
      if (err) {
        console.error(err);
        return;
      }
      if (result) {
        console.log(result);
      }
    })
    .catch((reason) => {
      console.log(reason);
    });

  sender.then((res) => {
    if (res) {
      for (let i = 0; i < 10; i++) {
        res.write({
          channel: 'events.stream',
          body: Utils.stringToBytes('event message'),
        });
      }
    }
  });
}
main();