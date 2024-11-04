import { Paper, rem, ThemeIcon, Text, Transition } from "@mantine/core";
import classes from "./info.module.css";
import {
  IconColorSwatch,
  IconInfoSquare,
  IconInfoTriangle,
  IconInfoTriangleFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export function Info() {
  const { t, i18n } = useTranslation();

  return (
    <Paper withBorder radius="md" className={classes.card}>
      <ThemeIcon
        size="xl"
        radius="md"
        variant="gradient"
        gradient={{ deg: 0, from: "pink", to: "orange" }}
      >
        <IconInfoTriangleFilled
          style={{ width: rem(28), height: rem(28) }}
          stroke={1.5}
        />
      </ThemeIcon>
      <Text size="xl" fw={500} mt="md">
        {t("operators.info.title")}
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
        {t("operators.info.p1")}&nbsp;
        <a href="https://www.nalog.gov.ru/rn77/taxation/submission_statements/el_count/#t2">
          https://www.nalog.gov.ru/rn77/taxation/submission_statements/el_count/#t2
        </a>
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
        {t("operators.info.p2")}
      </Text>
      <Text size="sm" mt="sm" c="dimmed">
        {t("operators.info.p3")}
      </Text>
    </Paper>
  );
}
