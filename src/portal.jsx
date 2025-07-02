import {useContext, useEffect} from "react"
import {shapeComponent, ShapeComponent} from "set-state-compare/src/shape-component"
import {HostsContext} from "./portal-host"
import memo from "set-state-compare/src/memo"
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
  mounted = false

  setup() {
    const hostsContext = useContext(HostsContext)

    if (!hostsContext) throw new Error("No hosts context - have you set up a PortalHost?")

    const {host, hosts} = hostsContext

    this.lastHost = host
    this.provider = useContext(PortalsContext)
    this.host = hosts[this.p.host]

    if (!this.host) throw new Error(`Couldn't find host ${this.p.host} for ${this.props.name || this.tt.id} in ${Object.keys(hosts).join(", ")}`)
    if (!this.provider) throw new Error("No provider was set")
    if (this.mounted) this.host?.setContent(this)

    useEffect(() => {
      this.provider.registerPortal(this)
      this.host?.registerPortal(this)
      this.host?.setContent(this)
      this.mounted = true

      return () => {
        this.host?.unregisterPortal(this)
        this.provider.unregisterPortal(this)
      }
    }, [])
  }

  render = () => null
}))
