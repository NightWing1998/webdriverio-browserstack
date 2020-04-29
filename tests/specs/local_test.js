var common = require('./helper/common');
var sessionId;
var globalResult = 'complete';

describe('BrowserStack Local Testing', function() {
  it('can check tunnel working', function () {
    browser.url('http://bs-local.com:45691/check')
    browser.getPageSource().should.match(/Up and running/i);
  });

  it('test status can be marked on BrowserStack', () => {
    // this is just a dummy test in the same session (same suite) with a delay so that the afterEach hook executes.
    // workaround for mocha 5.6.3 issue where afterEach hook does not complete before the describe test completes.
      browser.pause(2000)

  });

  afterEach(function(done){
    const finalTestStatus = this.currentTest.state
    if((finalTestStatus === 'passed' && globalResult === 'complete') || (finalTestStatus === 'failed') ) {
      common.mark_test_status(browser.sessionId, finalTestStatus , "N/A", this.currentTest.parent.title)
      globalResult = finalTestStatus
    }
    });
});
