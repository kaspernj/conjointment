// @ts-check

import React, {createContext} from "react"
import memo from "set-state-compare/build/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"

import {HostsContext} from "./portal-host"

const PortalsContext = createContext(/** @type {any | null} */ (null))

export {PortalsContext}

/**
 * @typedef {object} PortalProviderProps
 * @property {import("react").ReactNode} [children]
 */

/**
 * @typedef {object} RegisteredHost
 * @property {{id: string}} tt
 * @property {(registeredPortal: RegisteredPortal) => void} registerPortal
 */

/**
 * @typedef {object} RegisteredPortal
 * @property {{id: string}} tt
 * @property {{host: string}} p
 */

/** @extends {ShapeComponent<PortalProviderProps>} */
class ConjointmentPortalProvider extends ShapeComponent {
  /** @type {Record<string, RegisteredHost>} */
  hosts = {}
  /** @type {Record<string, RegisteredHost>} */
  newHosts = {}
  /** @type {Record<string, RegisteredPortal>} */
  portals = {}
  providerValue = {provider: this}

  /** @param {RegisteredHost} registeredHost */
  registerHost(registeredHost) {
    const {hosts} = this.tt
    const hostId = registeredHost.tt.id

    if (hostId in hosts) throw new Error(`Host ${hostId} already registered`)

    hosts[hostId] = registeredHost

    for (const portalId in this.tt.portals) {
      const registeredPortal = this.tt.portals[portalId]

      if (registeredPortal.p.host == hostId) {
        registeredHost.registerPortal(registeredPortal)
      }
    }
  }

  /** @param {RegisteredHost} registeredHost */
  unregisterHost(registeredHost) {
    delete this.tt.hosts[registeredHost.tt.id]
  }

  /** @param {RegisteredPortal} registeredPortal */
  registerPortal(registeredPortal) {
    this.portals[registeredPortal.tt.id] = registeredPortal
  }

  /** @param {RegisteredPortal} registeredPortal */
  unregisterPortal(registeredPortal) {
    delete this.portals[registeredPortal.tt.id]
  }

  render() {
    return (
      <PortalsContext.Provider value={this}>
        <HostsContext.Provider value={this.tt.newHosts}>{this.props.children}</HostsContext.Provider>
      </PortalsContext.Provider>
    )
  }
}

export default memo(shapeComponent(ConjointmentPortalProvider))
