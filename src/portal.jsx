import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import {useContext, useEffect} from "react"
import memo from "set-state-compare/build/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"

import {HostsContext} from "./portal-host"
import {PortalsContext} from "./portal-provider"

const shared = {
  idCount: 0
}

export default memo(shapeComponent(class ConjointmentPortal extends ShapeComponent {
  static defaultProps = {
    host: "base"
  }

  static propTypes = propTypesExact({
    children: PropTypes.any,
    host: PropTypes.string.isRequired,
    name: PropTypes.string
  })

  id = shared.idCount++
  mounted = false

  getName = () => this.props.name || this.tt.id

  setup() {
    const hostsContext = useContext(HostsContext)

    if (!hostsContext) throw new Error("No hosts context - have you set up a PortalHost?")

    const {host: parentHost, hosts} = hostsContext

    const targetHost = parentHost.getHostByName(this.p.host) || hosts[this.p.host]

    this.provider = useContext(PortalsContext)

    if (!targetHost) throw new Error(`Couldn't find host ${this.p.host} for ${this.props.name || this.tt.id} in ${Object.keys(hosts).join(", ")}`)
    if (!this.provider) throw new Error("No provider was set")
    if (this.tt.mounted) targetHost?.setContent(this)

    useEffect(() => {
      this.provider.registerPortal(this)

      return () => {
        this.provider.unregisterPortal(this)
      }
    }, [])

    useEffect(() => {
      // Unmount if already mounted on a different host
      if (this.currentTargetHost) {
        this.currentTargetHost?.unregisterPortal(this)
      }

      targetHost?.registerPortal(this)
      targetHost?.setContent(this)

      this.currentTargetHost = targetHost
      this.mounted = true

      return () => {
        targetHost?.unregisterPortal(this)
        this.mounted = false
      }
    }, [targetHost])
  }

  render = () => null
}))
