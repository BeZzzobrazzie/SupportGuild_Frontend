import { useSelector } from "react-redux"
import { RootState } from "src/00_app/store"
import { Entity } from "../../entity"


export function Root() {

  const rootChildren = useSelector((state: RootState) => state.explorer).filter(item => item.parent === -1)

  return (
    <ul className="root">
      {rootChildren.map((entity) => <Entity key={entity.id} entity={entity} />)}
      {/* <li>one</li>
      <li>two
        <ul>
          <li>two.one</li>
          <li>two.two</li>
        </ul>
      </li>
      <li>three</li> */}
    </ul>
  )
}