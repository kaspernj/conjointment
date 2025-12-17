import React, {createContext} from "react"
import memo from "set-state-compare/build/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"

import {HostsContext} from "./portal-host"

const PortalsContext = createContext()

export {PortalsContext}

export default memo(shapeComponent(class ConjointmentPortalProvider extends ShapeComponent {
  hosts = {}
  newHosts = {}
  portals = {}
  providerValue = {provider: this}

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

  unregisterHost(host) {
    delete this.tt.hosts[host.tt.id]
  }

  registerPortal(portal) {
    this.portals[portal.tt.id] = portal
  }

  unregisterPortal(portal) {
    delete this.portals[portal.tt.id]
  }

  render() {
    return (
      <PortalsContext.Provider value={this}>
        <HostsContext.Provider value={this.tt.newHosts}>
          {this.props.children}
        </HostsContext.Provider>
      </PortalsContext.Provider>
    )
  }
}))
