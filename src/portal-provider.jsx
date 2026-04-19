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
 * @typedef {object} HostLike
 * @property {{id: string}} tt
 * @property {(portal: PortalLike) => void} registerPortal
 */

/**
 * @typedef {object} PortalLike
 * @property {{id: string}} tt
 * @property {{host: string}} p
 */

/** @extends {ShapeComponent<PortalProviderProps>} */
class ConjointmentPortalProvider extends ShapeComponent {
  /** @type {Record<string, HostLike>} */
  hosts = {}
  /** @type {Record<string, HostLike>} */
  newHosts = {}
  /** @type {Record<string, PortalLike>} */
  portals = {}
  providerValue = {provider: this}

  /** @param {HostLike} host */
  registerHost(host) {
    const {hosts} = this.tt
    const {id} = host.tt

    if (id in hosts) throw new Error(`Host ${id} already registered`)

    hosts[id] = host

    for (const key in this.tt.portals) {
      const portal = this.tt.portals[key]

      if (portal.p.host == id) {
        host.registerPortal(portal)
      }
    }
  }

  /** @param {HostLike} host */
  unregisterHost(host) {
    delete this.tt.hosts[host.tt.id]
  }

  /** @param {PortalLike} portal */
  registerPortal(portal) {
    this.portals[portal.tt.id] = portal
  }

  /** @param {PortalLike} portal */
  unregisterPortal(portal) {
    delete this.portals[portal.tt.id]
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
