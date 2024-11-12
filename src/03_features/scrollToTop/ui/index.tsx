import { useEffect, useState } from "react";
import classes from "./style.module.css";
import { ActionIcon } from "@mantine/core";
import { IconArrowBarUp, IconArrowNarrowUp } from "@tabler/icons-react";

export function ScrollToTopButton() {
  const [showButton, setShowButton] = useState(false);
  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.pageYOffset > 300 ? setShowButton(true) : setShowButton(false);
    };
    window.addEventListener("scroll", handleScrollButtonVisibility);
    return () => {
      window.removeEventListener("scroll", handleScrollButtonVisibility);
    };
  }, []);

  return (
    <>
      {showButton && (
        <div className={classes["button-wrapper"]}>
          <ActionIcon
            radius={"xl"}
            size={"lg"}
            variant="filled"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={classes["button"]}
          >
            <IconArrowNarrowUp />
          </ActionIcon>
        </div>
      )}
    </>
  );
}
