
import expect from 'expect.js';
import MlbClient from '../client/mlb-client';

describe('MlbClient', function() {

  let mlbClient;
  let url = 'http://localhost:8888/';

  const testServerName = 'test.example.com';
  const testPort = 1234;
  let testId;

  beforeEach(function() {
    mlbClient = new MlbClient({url});
  });

  it('should initialize', function() {
    expect(mlbClient instanceof MlbClient).to.be(true);
  });

  it('should make domains', function() {
    return mlbClient.domains.create({
      serverName: testServerName,
      port: testPort,
    }).then(function(domain) {
      expect(domain.serverName).to.be(testServerName);
      expect(domain.port).to.be(testPort);
      // expect(domain.id).to.be.ok;
      // testId = domain.id;
    });
  });

  // it('should retrieve domains', function() {
  //   return mlbClient.domains.get().then(function(domains) {
  //     console.log(domains);
  //     let domain = domains[0];
  //     expect(domain.serverName).to.be(testServerName);
  //     expect(domain.port).to.be(testPort);
  //     expect(domain.id).to.be.ok;
  //   });
  // });
});
