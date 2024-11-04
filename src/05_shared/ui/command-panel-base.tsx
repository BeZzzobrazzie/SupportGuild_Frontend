import classes from "./command-panel-base.module.css";

export function CommandPanelBase({ children }: { children: JSX.Element }) {
  return (
    <>
      <div className={classes["command-panel__container"]}>
        <div className={classes["command-panel"]}>{children}</div>
      </div>
    </>
  );
}
