import classes from "./style.module.css"


interface PageLayoutProps {
  navbar: JSX.Element,
  children: JSX.Element,
}

export function PageLayout({navbar, children}: PageLayoutProps) {
  return (
    <>
      <div className={classes["layout"]}>
        {navbar}
        <div className={classes["content"]}>
          {children}
        </div>
      </div>
    </>
  );
}
