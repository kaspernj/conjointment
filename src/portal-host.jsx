import React, {createContext, Fragment, useContext, useEffect, useMemo} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import memo from "set-state-compare/src/memo"
import {PortalsContext} from "./portal-provider"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"

const HostsContext = createContext()

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

  setup() {
    const {hosts} = useContext(HostsContext)

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

  registerPortal(portal) {
    const newPortals = Object.assign({}, this.s.portals)

    newPortals[portal.tt.id] = portal.props.children

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
