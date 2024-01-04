const mysql = require('mysql');
const database = require('../../config/db');

// dev setup : ganti dengan database.dev
const connection = mysql.createConnection(database.prod);

/**
 * @param {*} idsso
 * fungsi untuk mengambil id telegramn, id fcm, dan lainnya
 */
const getMcaAccount = (idSso) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM user_mca WHERE id_sso=${idSso}`
        connection.query(query, function (error, result) {
            if (error) {
                reject(error)
            } else if (result.length <= 0 || result.length == null) {
                resolve(result)
            } else if (result.length != null && result.length >= 1) {
                resolve(result)
            } else {
                console.log("data not found");
            }
        })
    })
}

module.exports = { getMcaAccount }