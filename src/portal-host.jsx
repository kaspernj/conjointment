import {createContext, Fragment, useContext, useEffect} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import memo from "set-state-compare/src/memo"
import {PortalsContext} from "./portal-provider"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"

const HostsContext = createContext()

export {HostsContext}

export default memo(shapeComponent(class ConjointmentPortalsHost extends ShapeComponent {
  static defaultProps = {
    name: "base"
  }

  static propTypes = propTypesExact({
    children: PropTypes.node,
    name: PropTypes.string
  })

  setup() {
    const {hosts} = useContext(HostsContext)

    this.provider = useContext(PortalsContext)
    this.newHosts = Object.assign({}, hosts)
    this.newHosts[this.p.name] = this

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
    return (
      <HostsContext.Provider value={{host: this, hosts: this.tt.newHosts}}>
        {Object.keys(this.s.portals).map((id) =>
          <Fragment key={id}>
            {this.s.portals[id]}
          </Fragment>
        )}
        {this.props.children}
      </HostsContext.Provider>
    )
  }
}))
