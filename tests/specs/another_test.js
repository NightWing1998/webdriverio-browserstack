var common = require('./helper/common');
var sessionId;
var globalStatus = 'complete';
var actualResult, expectedResult = "BrowserStack - Bing"

describe('Bing Search Functionality', () => {
  it('can find search results', () => {
      sessionId = browser.sessionId
      browser.url('https://www.bing.com');
      $('[name="q"]').setValue("BrowserStack\n");
      //$('[name="btnK"]').click();
      browser.pause(1000)
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
    if((finalTestStatus === 'passed' && globalStatus === 'complete') || (finalTestStatus === 'failed') ) {
      if(finalTestStatus === 'passed') {
        common.mark_test_status(browser.sessionId, finalTestStatus , "Success: expected '"+ expectedResult+ "'" + " matches ''" + actualResult + "'", this.currentTest.parent.title)
      }
      else {
        common.mark_test_status(browser.sessionId, finalTestStatus , "expected '"+ expectedResult+ "'" + " to equal ''" + actualResult + "'", this.currentTest.parent.title)
      }

      globalStatus = finalTestStatus
    }
    });
});
