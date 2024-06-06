import { useSelector } from "react-redux";
import { entityType } from "../../lib/types";
import { RootState } from "src/00_app/store";


interface EntityProps {
  entity: entityType;
}
export function Entity({entity}: EntityProps) {

  const children = useSelector((state: RootState) => state.explorer.filter(item => item.parent === entity.id))

  switch (entity.type) {
    case "folder":
      return (
        <li>{entity.name}
          <ul>
            {children.map((child) => <Entity key={child.id} entity={child} />)}
          </ul>
        </li>
      )
      break;
    case "file":
      return (
        <li>{entity.name}</li>
      )


      break;
    case "heading":
      break;
  }

  return <></>;
}
