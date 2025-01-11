// Import required modules
const { expect } = require('chai');
const ocppService = require('../services/ocppService');

describe('OCPP Service Tests', () => {
  beforeEach(() => {
    // Reset the state before each test
    ocppService.chargers = {};
  });

  it('should register a new charger', () => {
    const chargerId = 'charger-1';
    ocppService.registerCharger(chargerId);
    expect(ocppService.chargers).to.have.property(chargerId);
    expect(ocppService.chargers[chargerId]).to.have.keys('A', 'B');
  });

  it('should start a charging session on connector A', () => {
    const chargerId = 'charger-1';
    const sessionId = 'session-123';
    ocppService.registerCharger(chargerId);

    ocppService.startCharging(chargerId, 'A', sessionId);

    expect(ocppService.chargers[chargerId].A.status).to.equal('occupied');
    expect(ocppService.chargers[chargerId].A.currentSession).to.equal(sessionId);
  });

  it('should throw an error if connector is already occupied', () => {
    const chargerId = 'charger-1';
    const sessionId = 'session-123';
    ocppService.registerCharger(chargerId);
    ocppService.startCharging(chargerId, 'A', sessionId);

    expect(() => {
      ocppService.startCharging(chargerId, 'A', 'session-456');
    }).to.throw('Connector A on charger charger-1 is not available.');
  });

  it('should stop a charging session on connector A', () => {
    const chargerId = 'charger-1';
    const sessionId = 'session-123';
    ocppService.registerCharger(chargerId);
    ocppService.startCharging(chargerId, 'A', sessionId);

    ocppService.stopCharging(chargerId, 'A');

    expect(ocppService.chargers[chargerId].A.status).to.equal('available');
    expect(ocppService.chargers[chargerId].A.currentSession).to.be.null;
  });

  it('should throw an error if stopping an unoccupied connector', () => {
    const chargerId = 'charger-1';
    ocppService.registerCharger(chargerId);

    expect(() => {
      ocppService.stopCharging(chargerId, 'A');
    }).to.throw('Connector A on charger charger-1 is not occupied.');
  });
});
