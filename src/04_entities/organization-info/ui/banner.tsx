import { Paper, Text } from "@mantine/core";
import classes from "./banner.module.css";
import { useTranslation } from "react-i18next";

export function Banner() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Paper className={classes["paper"]}>
        <Text size="xl" fw={500} mt="md">
          {t("organizationInfo.emptyBanner.title")}
        </Text>
        <Text size="sm" mt="sm" c="dimmed">
          {t("organizationInfo.emptyBanner.text")}
        </Text>
      </Paper>
    </>
  );
}
