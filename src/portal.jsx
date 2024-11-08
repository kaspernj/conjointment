import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {HostsContext} from "./portal-host"
import memo from "set-state-compare/src/memo"
import {useContext, useEffect, useMemo} from "react"
import {PortalsContext} from "./portal-provider"
import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"

const shared = {
  idCount: 0
}

export default memo(shapeComponent(class ConjointmentPortal extends ShapeComponent {
  static defaultProps = {
    host: "base"
  }

  static propTypes = propTypesExact({
    children: PropTypes.node,
    host: PropTypes.string.isRequired,
    name: PropTypes.string
  })

  id = shared.idCount++

  setup() {
    const {host, hosts} = useContext(HostsContext)

    this.lastHost = host
    this.provider = useContext(PortalsContext)
    this.host = hosts[this.p.host]

    if (!this.host) throw new Error(`Couldn't find host ${this.p.host} for ${this.props.name || this.tt.id} in ${Object.keys(hosts).join(", ")}`)
    if (!this.provider) throw new Error("No provider was set")

    useMemo(() => {
      this.host?.registerPortal(this)
      this.provider.registerPortal(this)
    }, [])

    this.host?.setContent(this)

    useEffect(() => {
      return () => {
        this.host?.unregisterPortal(this)
        this.provider.unregisterPortal(this)
      }
    }, [])
  }

  render = () => null
}))