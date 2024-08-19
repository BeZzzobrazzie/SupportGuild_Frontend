import classes from "./explorer-item.module.css";

export function Indent({ nestingLevel }: { nestingLevel: number }) {
  const indent = Array(nestingLevel)
    .fill(0)
    .map((_, index) => (
      <div key={index} className={classes["explorer-item__indent"]}></div>
    ));
  return <>{indent}</>;
}
