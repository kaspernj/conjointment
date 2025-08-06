import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import React, {createContext, Fragment, useContext, useEffect, useMemo} from "react"
import memo from "set-state-compare/src/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"

import {PortalsContext} from "./portal-provider"

const HostsContext = createContext()
const shared = {
  idCount: 0
}

export {HostsContext}

export default memo(shapeComponent(class ConjointmentPortalHost extends ShapeComponent {
  static defaultProps = {
    name: "base",
    placement: "above"
  }

  static propTypes = propTypesExact({
    children: PropTypes.node,
    name: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired
  })

  id = shared.idCount++

  getName = () => this.p.name

  setup() {
    const {host: parentHost, hosts} = useContext(HostsContext)

    this.parentHost = parentHost
    this.provider = useContext(PortalsContext)
    this.newHosts = useMemo(() => {
      const newHosts = Object.assign({}, hosts)

      newHosts[this.p.name] = this

      return newHosts
    }, [this.p.name, hosts])

    if (!this.provider) throw new Error("No provider was set")

    this.useStates({
      portals: {}
    })

    useEffect(() => {
      this.provider.registerHost(this)

      return () => {
        this.provider.unregisterHost(this)
      }
    }, [])
  }

  getHostByName(hostName) {
    if (this.p.name == hostName) return this

    return this.parentHost?.getHostByName(hostName)
  }

  registerPortal(portal) {
    const {id} = portal.tt

    if (id in this.s.portals) throw new Error(`Portal already registered: ${portal.getName()}`)

    const newPortals = Object.assign({}, this.s.portals)

    newPortals[id] = portal.props.children

    this.setState({portals: newPortals})
  }

  setContent(portal) {
    const newPortals = Object.assign({}, this.s.portals)

    if (!(portal.tt.id in newPortals)) throw new Error(`No such portal: ${portal.p.name} (${portal.tt.id})`)

    newPortals[portal.tt.id] = portal.props.children

    this.setState({portals: newPortals})
  }

  unregisterPortal(portal) {
    const newPortals = Object.assign({}, this.s.portals)

    delete newPortals[portal.tt.id]

    this.setState({portals: newPortals})
  }

  render() {
    const providerValue = useMemo(() => ({host: this, hosts: this.tt.newHosts}), [this.tt.newHosts])

    return (
      <HostsContext.Provider value={providerValue}>
        {this.p.placement == "above" && this.portalContent()}
        {this.props.children}
        {this.p.placement == "below" && this.portalContent()}
      </HostsContext.Provider>
    )
  }

  portalContent = () => Object.keys(this.s.portals).map((id) =>
    <Fragment key={`portal-${id}`}>
      {this.s.portals[id]}
    </Fragment>
  )
}))
