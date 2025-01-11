// Import required modules
const EventEmitter = require('events');

// Simulate OCPP server behavior with EventEmitter
class OCPPService extends EventEmitter {
  constructor() {
    super();
    this.chargers = {}; // Store charger states by ID
  }

  // Register a new charger
  registerCharger(chargerId) {
    if (!this.chargers[chargerId]) {
      this.chargers[chargerId] = {
        A: { status: 'available', currentSession: null },
        B: { status: 'available', currentSession: null },
      };
      console.log(`Charger ${chargerId} registered.`);
      this.emit('chargerRegistered', chargerId);
    }
  }

  // Start a charging session
  startCharging(chargerId, connector, sessionId) {
    if (!this.chargers[chargerId] || !this.chargers[chargerId][connector]) {
      throw new Error(`Charger or connector not found: ${chargerId} - ${connector}`);
    }

    const connectorState = this.chargers[chargerId][connector];
    if (connectorState.status !== 'available') {
      throw new Error(`Connector ${connector} on charger ${chargerId} is not available.`);
    }

    connectorState.status = 'occupied';
    connectorState.currentSession = sessionId;
    console.log(`Charging started: ${chargerId} - ${connector} - Session ${sessionId}`);
    this.emit('chargingStarted', { chargerId, connector, sessionId });
  }

  // Stop a charging session
  stopCharging(chargerId, connector) {
    if (!this.chargers[chargerId] || !this.chargers[chargerId][connector]) {
      throw new Error(`Charger or connector not found: ${chargerId} - ${connector}`);
    }

    const connectorState = this.chargers[chargerId][connector];
    if (connectorState.status !== 'occupied') {
      throw new Error(`Connector ${connector} on charger ${chargerId} is not occupied.`);
    }

    const sessionId = connectorState.currentSession;
    connectorState.status = 'available';
    connectorState.currentSession = null;
    console.log(`Charging stopped: ${chargerId} - ${connector} - Session ${sessionId}`);
    this.emit('chargingStopped', { chargerId, connector, sessionId });
  }

  // Get the status of a charger
  getChargerStatus(chargerId) {
    if (!this.chargers[chargerId]) {
      throw new Error(`Charger not found: ${chargerId}`);
    }
    return this.chargers[chargerId];
  }
}

// Export a singleton instance of OCPPService
module.exports = new OCPPService();
