declare module "prop-types-exact" {
  import type {ValidationMap} from "prop-types"

  export default function propTypesExact<P>(propTypes: ValidationMap<P>): ValidationMap<P>
}
