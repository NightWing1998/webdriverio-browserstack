var request = require('request');

async function mark_test_status(sessionId, status, reason, name) {

    var options = {
      method: 'PUT',
      uri: 'https://' +process.env.BROWSERSTACK_USERNAME +':' + process.env.BROWSERSTACK_ACCESS_KEY + '@api.browserstack.com/automate/sessions/' + sessionId + '.json',
      headers: {
           'content-type': 'application/json'
      },
      form: {
          status: status,
          reason: reason,
          name: name
      }
  };


  await request(options)
      //.then(function (body) {
          // POST succeeded...
      //})
    //  .catch(function (err) {
          // POST failed...
      //    console.info("Error: " +  err)
    //  });
}

module.exports.mark_test_status = mark_test_status;
