// @ts-check

import PropTypes from "prop-types"
import propTypesExact from "prop-types-exact"
import React, {createContext, Fragment, useContext, useEffect, useMemo} from "react"
import memo from "set-state-compare/build/memo"
import {shapeComponent, ShapeComponent} from "set-state-compare/build/shape-component"

import {PortalsContext} from "./portal-provider"

const HostsContext = createContext(/** @type {any | null} */ (null))
const shared = {
  idCount: 0
}

export {HostsContext}

/**
 * @typedef {object} PortalHostProps
 * @property {import("react").ReactNode} [children]
 * @property {string} name
 * @property {string} placement
 */

/**
 * @typedef {object} PortalHostState
 * @property {Record<string, import("react").ReactNode>} portals
 */

/**
 * @typedef {object} PortalLike
 * @property {any} tt
 * @property {{children?: import("react").ReactNode}} props
 * @property {{name?: string}} p
 * @property {() => string} getName
 */

/** @extends {ShapeComponent<PortalHostProps, PortalHostState>} */
class ConjointmentPortalHost extends ShapeComponent {
  static defaultProps = {
    name: "base",
    placement: "above"
  }

  static propTypes = propTypesExact({
    children: PropTypes.any,
    name: PropTypes.string.isRequired,
    placement: PropTypes.string.isRequired
  })

  id = shared.idCount++
  /** @type {PortalHostState} */
  state = {
    /** @type {Record<string, import("react").ReactNode>} */
    portals: {}
  }

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

    useEffect(() => {
      this.provider.registerHost(this)

      return () => {
        this.provider.unregisterHost(this)
      }
    }, [])
  }

  /**
   * @param {string} hostName
   * @returns {ConjointmentPortalHost | undefined}
   */
  getHostByName(hostName) {
    if (this.p.name == hostName) return this

    return this.parentHost?.getHostByName(hostName)
  }

  /** @param {PortalLike} portal */
  registerPortal(portal) {
    const {id} = portal.tt

    if (id in this.s.portals) throw new Error(`Portal already registered: ${portal.getName()}`)

    const newPortals = Object.assign({}, this.s.portals)

    newPortals[id] = portal.props.children

    this.s.portals = newPortals
  }

  /** @param {PortalLike} portal */
  setContent(portal) {
    const newPortals = Object.assign({}, this.s.portals)

    if (!(portal.tt.id in newPortals)) throw new Error(`No such portal: ${portal.p.name} (${portal.tt.id})`)

    newPortals[portal.tt.id] = portal.props.children

    this.s.portals = newPortals
  }

  /** @param {PortalLike} portal */
  unregisterPortal(portal) {
    const newPortals = Object.assign({}, this.s.portals)

    delete newPortals[portal.tt.id]

    this.s.portals = newPortals
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

  portalContent = () => Object.keys(this.s.portals).map((id) => <Fragment key={`portal-${id}`}>{this.s.portals[id]}</Fragment>)
}

const ConjointmentPortalHostShapeComponent = shapeComponent(ConjointmentPortalHost)

export default memo(ConjointmentPortalHostShapeComponent)
