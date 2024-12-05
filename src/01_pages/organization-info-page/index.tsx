import { Navbar } from "src/02_widgets/navbar";
import classes from "./style.module.css";
import {
  Container,
  Table,
  TextInput,
  Text,
  Loader,
  Button,
} from "@mantine/core";
import { useGetOrgInfoMutation } from "src/04_entities/organization-info/api/mutations";
import { FormEvent, useState } from "react";
import {
  CollapseBase,
  OrgCommandPanel,
  OrgInfoBanner,
  OrgInfoRow,
  OrgInfoTabs,
  OrgTableBase,
} from "src/04_entities/organization-info";
import {
  IconBook2,
  IconFilter,
  IconHome,
  IconSquareLetterA,
  IconSquareLetterK,
  IconSquareLetterT,
  IconStar,
  IconZoom,
} from "@tabler/icons-react";
import { organizationInfoData } from "src/04_entities/organization-info/api/types";
import { KonturInfo } from "src/04_entities/organization-info/ui/kontur-info";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";

export function OrganizationInfoPage() {
  const [currentInn, setCurrentInn] = useState<string>("");
  const [mutationData, setMutationData] = useState<
    organizationInfoData[] | null
  >(null);

  const getOrgInfoMutation = useGetOrgInfoMutation({ setMutationData });

  // function handleSubmit(e: FormEvent<HTMLFormElement>) {
  //   e.preventDefault();
  //   getOrgInfoMutation.mutate({ inn });
  // }

  const konturContent = getOrgInfoMutation.isPending ? (
    <div className={classes["wrapper-loader"]}>
        <Loader size={100} type="bars"/>
    </div>
  ) : mutationData ? (
    <>
      <KonturInfo inn={currentInn} />
      <OrgTableBase
        content={mutationData.map((item, index) => {
          return (
            <OrgInfoRow
              data={{
                kpp: item.kpp,
                name: item.name,
                id: item.id,
                status: item["date of liquidation of counterparty"],
              }}
              key={index}
            />
          );
        })}
      />
    </>
  ) : (
    <OrgInfoBanner />
  );
  const tabsContent = [
    {
      key: "kontur",
      icon: <IconSquareLetterK />,
      title: "СКБ Контур",
      content: konturContent,
    },
    {
      key: "tensor",
      icon: <IconSquareLetterT />,
      title: "Тензор",
      content: <></>,
      disabled: true,
    },
    {
      key: "astral",
      icon: <IconSquareLetterA />,
      title: "Калуга-Астрал",
      content: <></>,
      disabled: true,
    },
    {
      key: "egrul",
      icon: <IconBook2 />,
      title: "ЕГРЮЛ",
      content: <></>,
      disabled: true,
    },
  ];

  return (
    <>
      <div className={classes["page"]}>
        <Navbar />
        <div className={classes["page-content"]}>
          <Container className={classes["page-container"]}>
            <OrgCommandPanel
              getOrgInfoMutation={getOrgInfoMutation}
              setCurrentInn={setCurrentInn}
            />
            <OrgInfoTabs props={tabsContent} />
          </Container>
        </div>
      </div>
    </>
  );
}
