import { Table } from "@mantine/core";
import classes from "./row.module.css";

interface RowProps {
  kpp?: string;
  name?: string;
  id?: string;
}
export function Row({ data }: { data: RowProps }) {
  return (
    <Table.Tr>
      <Table.Td className={classes["cell"]}>{data.kpp}</Table.Td>
      <Table.Td className={classes["cell"]}>{data.id}</Table.Td>
      <Table.Td className={classes["cell"]}>{data.name}</Table.Td>

      {/* <Table.Th className={classes["cell"]}>
    </Table.Th>
    <Table.Th className={classes["cell"]}></Table.Th>
    <Table.Th className={classes["cell"]}></Table.Th> */}
    </Table.Tr>
  );
}
