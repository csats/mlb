
import expect from 'expect.js';
import MlbClient from '../client/mlb-client';

describe('MlbClient', function() {

  let mlbClient;
  let url = 'http://localhost:8888/';

  const testServerName = 'test.example.com';
  const testServerName2 = 'test2.example.com';
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
      expect(domain.id).to.be.ok;
      testId = domain.id;
    });
  });

  it('should retrieve domains', function() {
    return mlbClient.domains.get(testId).then(function(domain) {
      expect(domain.serverName).to.be(testServerName);
      expect(domain.port).to.be(testPort);
      expect(domain.id).to.be.ok;
    });
  });

  it('should alter domains', function() {
    return mlbClient.domains.update(testId, {serverName: testServerName2})
    .then(function(domain) {
      expect(domain).to.be.ok;
      expect(domain.serverName).to.be(testServerName2);
      expect(domain.id).to.be(testId);
    })
  });

  it('should list domains', function() {
    return mlbClient.domains.get().then(function(domains) {
      let domain = domains.filter(d => d.id === testId)[0];
      expect(domain).to.be.ok;
      expect(domain.serverName).to.be(testServerName2);
      expect(domain.port).to.be(testPort);
    });
  });

  it('should remove domains', function() {
    return mlbClient.domains.remove(testId)
    .then(function() {
      return mlbClient.domains.get();
    })
    .then(function(domains) {
      domains.forEach(function (domain) {
        expect(domain.id).to.not.be(testId);
      });
    });
  });
});
