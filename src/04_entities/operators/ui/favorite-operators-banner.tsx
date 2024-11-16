import { Paper, Text } from "@mantine/core";
import classes from "./favorite-operators-banner.module.css";
import { useTranslation } from "react-i18next";

export function FavoriteOperatorsBanner() {
  const { t, i18n } = useTranslation();

  return (
    <>
      <Paper className={classes["paper"]}>
        <Text size="xl" fw={500} mt="md">
          {t("operators.emptyTableBanner.title")}
        </Text>
        <Text size="sm" mt="sm" c="dimmed">
          {t("operators.emptyTableBanner.text")}
        </Text>
      </Paper>
    </>
  );
}
