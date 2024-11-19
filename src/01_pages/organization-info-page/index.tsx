import { Navbar } from "src/02_widgets/navbar";
import classes from "./style.module.css";
import { Table, TextInput } from "@mantine/core";
import { useGetOrgInfoMutation } from "src/04_entities/organization-info/api/mutations";
import { FormEvent, useState } from "react";
import { OrgTableBase } from "src/04_entities/organization-info";

export function OrganizationInfoPage() {
  const getOrgInfoMutation = useGetOrgInfoMutation();
  const [inn, setInn] = useState<string>("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getOrgInfoMutation.mutate(
      { inn },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );
  }

  return (
    <>
      <div className={classes["page"]}>
        <Navbar />
        <div className={classes["page-content"]}>
          <form onSubmit={(e) => handleSubmit(e)}>
            <TextInput value={inn} onChange={(e) => setInn(e.target.value)} />
          </form>
          {getOrgInfoMutation.data && (
            <OrgTableBase
              content={
                getOrgInfoMutation.data &&
                getOrgInfoMutation.data.map((item, index) => {
                  return (
                    <Row
                      data={{ kpp: item.kpp, name: item.name, id: item.id }}
                      key={index}
                    />
                  );
                })
              }
            />
          )}
        </div>
      </div>
    </>
  );
}

interface RowProps {
  kpp?: string;
  name?: string;
  id?: string;
}
function Row({ data }: { data: RowProps }) {
  return (
    <Table.Tr>
      <Table.Th className={classes["cell"]}>{data.kpp}</Table.Th>
      <Table.Th className={classes["cell"]}>{data.name}</Table.Th>
      <Table.Th className={classes["cell"]}>{data.id}</Table.Th>
      {/* <Table.Th className={classes["cell"]}>
    </Table.Th>
    <Table.Th className={classes["cell"]}></Table.Th>
    <Table.Th className={classes["cell"]}></Table.Th> */}
    </Table.Tr>
  );
}
