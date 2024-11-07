
import classes from "./style.module.css"

export function ScrollToTop() {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      className={classes["button"]}
    >
      click
    </button>
  );
}
