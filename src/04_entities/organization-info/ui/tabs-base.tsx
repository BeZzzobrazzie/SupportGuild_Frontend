import { Tabs } from "@mantine/core";
import {
  IconMessageCircle,
  IconPhoto,
  IconSettings,
} from "@tabler/icons-react";
import classes from "./tabs-base.module.css"

interface TabsBaseProps {
  key: string;
  icon: JSX.Element;
  title: string;
  content: JSX.Element | null;
  disabled?: boolean;
}
export function TabsBase({ props }: { props: TabsBaseProps[] }) {
  return (
    <>
      <Tabs color="orange" defaultValue={props[0].key} className={classes["tabs"]}>
        <Tabs.List>
          {props.map((item, index) => {
            return (
              <Tabs.Tab
                key={index}
                value={item.key}
                leftSection={item.icon}
                disabled={item.disabled}
              >
                {item.title}
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
        {props.map((item, index) => {
          return (
            <Tabs.Panel key={index} value={item.key} className={classes["tabs-panel"]}>
              {item.content}
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </>
  );
}
