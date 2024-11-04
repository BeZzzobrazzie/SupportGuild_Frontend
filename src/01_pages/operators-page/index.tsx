import classes from "./style.module.css";
import { Navbar } from "src/02_widgets/navbar";
import { PageLayout } from "src/05_shared/ui/page-layout";
import { OperatorsTable } from "src/02_widgets/operators-table";
import { Button, Container } from "@mantine/core";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";
import {
  IconFilter,
  IconInfoSquare,
  IconStar,
  IconZoom,
} from "@tabler/icons-react";
import { Info } from "./info/info";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export function OperatorsPage() {
  const [infoStatus, setInfoStatus] = useState(true);
  const { t, i18n } = useTranslation();

  return (
    <PageLayout navbar={<Navbar />}>
      <Container>
        <div className={classes["page-wrap"]}>
          <CommandPanelBase>
            <Button.Group>
              <Button
                leftSection={<IconStar />}
                size="sm"
                variant="default"
                // onClick={handleClickCopy}
                disabled
              >
                {t("operators.commandPanel.favorites")}
              </Button>

              <Button
                leftSection={<IconFilter />}
                size="sm"
                variant="default"
                // onClick={handleClickCopy}
                disabled
              >
                {t("operators.commandPanel.filter")}
              </Button>
              <Button
                leftSection={<IconInfoSquare />}
                size="sm"
                variant={infoStatus ? "outline" : "default"}
                onClick={() => setInfoStatus(!infoStatus)}
              >
                {t("operators.commandPanel.info")}
              </Button>
              <Button
                leftSection={<IconZoom />}
                size="sm"
                variant="default"
                // onClick={handleClickCopy}
                disabled
              >
                {t("operators.commandPanel.search")}
              </Button>
            </Button.Group>
          </CommandPanelBase>
          {infoStatus && <Info />}
          <OperatorsTable />
        </div>
      </Container>
    </PageLayout>
  );
}
