import { Navbar } from "src/02_widgets/navbar";
import classes from "./style.module.css";
import { Container, Table, TextInput } from "@mantine/core";
import { useGetOrgInfoMutation } from "src/04_entities/organization-info/api/mutations";
import { FormEvent, useState } from "react";
import {
  CollapseBase,
  OrgInfoRow,
  OrgTableBase,
} from "src/04_entities/organization-info";

export function OrganizationInfoPage() {
  const getOrgInfoMutation = useGetOrgInfoMutation();
  const [inn, setInn] = useState<string>("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    getOrgInfoMutation.mutate({ inn });
  }

  return (
    <>
      <div className={classes["page"]}>
        <Navbar />
        <div className={classes["page-content"]}>
          <Container>
            <form onSubmit={(e) => handleSubmit(e)}>
              <TextInput value={inn} onChange={(e) => setInn(e.target.value)} />
            </form>
            <CollapseBase title="Информация по данным оператора Контур">
              {getOrgInfoMutation.data && (
                <OrgTableBase
                  content={
                    getOrgInfoMutation.data &&
                    getOrgInfoMutation.data.map((item, index) => {
                      return (
                        <OrgInfoRow
                          data={{ kpp: item.kpp, name: item.name, id: item.id }}
                          key={index}
                        />
                      );
                    })
                  }
                />
              )}
            </CollapseBase>
          </Container>
        </div>
      </div>
    </>
  );
}
