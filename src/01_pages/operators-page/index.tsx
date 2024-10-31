import { useSuspenseQuery } from "@tanstack/react-query";
import { getOperatorsData } from "./api";
import { Table } from "@mantine/core";


export function OperatorsPage() {
  // const {
  //   isPending,
  //   isError,
  //   data,
  //   error,
  // } = useSuspenseQuery(getOperatorsData());

  console.log(data)
  const filteredData = data.filter((item: any) => {
    console.log(item)
    item[0].typeof() === "number"
  })
  
  const rows = filteredData.map((element) => (
    <Table.Tr key={element.name}>
      <Table.Td>{element.position}</Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.symbol}</Table.Td>
      <Table.Td>{element.mass}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Table>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>1</Table.Th>
        <Table.Th>2</Table.Th>
        <Table.Th>3</Table.Th>
        <Table.Th>4</Table.Th>
        <Table.Th>5</Table.Th>
        <Table.Th>6</Table.Th>
        <Table.Th>7</Table.Th>
        <Table.Th>8</Table.Th>
        <Table.Th>9</Table.Th>
        <Table.Th>10</Table.Th>
      </Table.Tr>
    </Table.Thead>
    <Table.Tbody>{rows}</Table.Tbody>
  </Table>
  )
}