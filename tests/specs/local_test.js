var common = require('./helper/common');
var sessionId;
var globalStatus = 'complete';
var actualResult, expectedResult = "Local Server"
var local_website_test = 'can test local websites'

describe('Local Website Testing on BrowserStack', function() {
  it('can check tunnel working', function () {
    browser.url('http://bs-local.com:45691/check')
    browser.getPageSource().should.match(/Up and running/i);
  });

  it(local_website_test, function () {
    browser.url('http://bs-local.com:8000')
    actualResult = browser.getTitle()
    actualResult.should.equal(expectedResult);
  });


  it('test status can be marked on BrowserStack', () => {
    // this is just a dummy test in the same session (same suite) with a delay so that the afterEach hook executes.
    // workaround for mocha 5.6.3 issue where afterEach hook does not complete before the describe test completes.
      browser.pause(2000)

  });

  afterEach(function(done){
    const finalTestStatus = this.currentTest.state
    if(this.currentTest.title === local_website_test) {
      if(finalTestStatus === 'passed') {
        common.mark_test_status(browser.sessionId, finalTestStatus , "Success: expected '"+ expectedResult+ "'" + " matches '" + actualResult + "'" , this.currentTest.parent.title)
      }
      else {
        common.mark_test_status(browser.sessionId, finalTestStatus , "expected '"+ expectedResult+ "'" + " to equal '" + actualResult + "'", this.currentTest.parent.title)
      }

      globalStatus = finalTestStatus
    }
    });
});
