import React, {createContext} from "react"
import memo from "set-state-compare/src/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"

import {HostsContext} from "./portal-host"

const PortalsContext = createContext()

export {PortalsContext}

export default memo(shapeComponent(class ConjointmentPortalProvider extends ShapeComponent {
  hosts = {}
  newHosts = {}
  portals = {}
  providerValue = {provider: this}

  registerHost(host) {
    const name = host.p.name

    this.tt.hosts[name] = host

    for (const key in this.tt.portals) {
      const portal = this.tt.portals[key]

      if (portal.p.host == name) {
        host.registerPortal(portal)
      }
    }
  }

  registerPortal(portal) {
    this.portals[portal.tt.id] = portal
  }

  unregisterHost(host) {
    delete this.tt.hosts[host.p.name]
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
