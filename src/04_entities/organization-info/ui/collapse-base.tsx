import { Button, Collapse } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

interface CollapseProps {
  title: string;
  children?: JSX.Element;
}
export function CollapseBase({ title, children }: CollapseProps) {
  const [opened, { toggle }] = useDisclosure(false);

  return (
    <>
      <Button variant="transparent" onClick={toggle}>
        {title}
      </Button>
      <Collapse in={opened}>{children}</Collapse>
    </>
  );
}
