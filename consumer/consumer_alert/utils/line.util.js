const axios = require('axios')

const sendLineMsg = async (message) => {
  try{
    await axios.post('https://notify-api.line.me/api/notify', { message }, { headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${process.env.LINE_API_TOKEN}`
    } })
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  sendLineMsg
}