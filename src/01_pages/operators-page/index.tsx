import classes from "./style.module.css";
import { Navbar } from "src/02_widgets/navbar";
import { PageLayout } from "src/05_shared/ui/page-layout";
import { OperatorsTable } from "src/02_widgets/operators-table";
import { Container } from "@mantine/core";

export function OperatorsPage() {
  return (
    <PageLayout navbar={<Navbar />}>
      <OperatorsTable />
    </PageLayout>
  );
}
