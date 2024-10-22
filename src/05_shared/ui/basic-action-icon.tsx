import { ActionIcon, Tooltip } from "@mantine/core";
import { Icon, IconError404, IconProps } from "@tabler/icons-react";
import React from "react";
import { ReactNode } from "react";

interface Props {
  label?: string;
  variant?: string;
  onClick?: () => void;
  icon?: JSX.Element;
}
export function BasicActionIcon({ label, variant, onClick, icon }: Props) {
  return (
    <BasicTooltip label={label}>
      <ActionIcon variant={variant} onClick={onClick}>
        {icon ? icon : <IconError404 />}
      </ActionIcon>
    </BasicTooltip>
  );
}

function BasicTooltip({
  label,
  children,
}: {
  label?: string;
  children: ReactNode;
}) {
  return (
    <>{label ? <Tooltip label={label}>{children}</Tooltip> : <>{children}</>}</>
  );
}
