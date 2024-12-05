import { Button, Paper, Text } from "@mantine/core";
import classes from "./kontur-info.module.css";
import { useTranslation } from "react-i18next";
import { IconFileTypeCsv } from "@tabler/icons-react";

interface KonturInfoProps {
  inn: string;
}
export function KonturInfo({ inn }: KonturInfoProps) {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Paper className={classes["paper"]}>
        <div className={classes["paper__left"]}>
          <Text size="xl" fw={500} mb="md" mt="6px">
            {t("organizationInfo.info.inn")}: {inn}
          </Text>
          <Button disabled variant="default" leftSection={<IconFileTypeCsv />}>
            {t("organizationInfo.info.loadResult")}
          </Button>
        </div>

        <div className={classes["paper__right"]}>
          <Text size="sm" mt="sm" c="dimmed">
            {t("organizationInfo.info.source")}:{" "}
            <a
              target="_blank"
              rel="noopener"
              href="https://www.diadoc.ru/check"
            >
              https://www.diadoc.ru/check
            </a>
          </Text>
        </div>
      </Paper>
    </>
  );
}
