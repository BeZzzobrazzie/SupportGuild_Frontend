import { Table } from "@mantine/core";
import { useTranslation } from "react-i18next";
import classes from "./org-table-base.module.css";

interface OrgTableBase {
  content: JSX.Element[];
}
export function OrgTableBase({ content }: OrgTableBase) {
  const { t, i18n } = useTranslation();

  return (
    <Table highlightOnHover className={classes["table"]}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th className={classes["cell"]}>
            {t("organizationInfo.table.kpp")}
          </Table.Th>
          <Table.Th className={classes["cell"]}>
            {t("organizationInfo.table.id")}
          </Table.Th>
          <Table.Th className={classes["cell"]}>
            {t("organizationInfo.table.name")}
          </Table.Th>
          <Table.Th className={classes["cell"]}>
            {t("organizationInfo.table.status")}
          </Table.Th>
          {/* <Table.Th className={classes["cell"]}>
          </Table.Th>
          <Table.Th className={classes["cell"]}></Table.Th>
          <Table.Th className={classes["cell"]}></Table.Th> */}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{content}</Table.Tbody>
    </Table>
  );
}
