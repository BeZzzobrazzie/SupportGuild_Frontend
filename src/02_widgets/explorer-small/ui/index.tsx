import { Box } from "@mantine/core";
import { ExplorerRoot } from "src/04_entities/explorer/";

import classes from "./style.module.css";


export function ExplorerSmall() {
  return (
    <Box className={classes["explorer-small"]}>
      {/* <h2>Explorer</h2> */}
      <ExplorerRoot />
    </Box>
  );
}
