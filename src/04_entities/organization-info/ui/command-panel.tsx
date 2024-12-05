import { ActionIcon, Button, TextInput } from "@mantine/core";
import {
  IconArrowBackUp,
  IconArrowRight,
  IconFilter,
  IconPencil,
  IconStar,
  IconZoom,
} from "@tabler/icons-react";
import { UseMutationResult } from "@tanstack/react-query";
import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { CommandPanelBase } from "src/05_shared/ui/command-panel-base";
import { initialData, organizationInfoData } from "../api/types";
import { useTranslation } from "react-i18next";

interface CommandPanelProps {
  getOrgInfoMutation: UseMutationResult<
    organizationInfoData[],
    Error,
    initialData,
    unknown
  >;
  setCurrentInn: Dispatch<SetStateAction<string>>;
}
export function CommandPanel({
  getOrgInfoMutation,
  setCurrentInn,
}: CommandPanelProps) {
  const { t, i18n } = useTranslation();

  const [innInputVisible, setInnInputVisible] = useState(false);
  const [inn, setInn] = useState<string>("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (/^\d{10}$/.test(inn) || /^\d{12}$/.test(inn)) {
      setInnInputVisible(false);
      // setInn("");
      getOrgInfoMutation.mutate(
        { inn },
        { onSuccess: () => setCurrentInn(inn) }
      );
    }
  }
  function handleReset() {
    setInnInputVisible(false);
    setInn("");
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.altKey &&
        (event.key === "i" || event.key === "I" || event.code === "KeyI")
      ) {
        event.preventDefault();
        setInnInputVisible(true);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        handleReset();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <CommandPanelBase>
      {innInputVisible ? (
        <form onSubmit={(e) => handleSubmit(e)}>
          <TextInput
            autoFocus
            value={inn}
            placeholder={t("commandPanel.input.innPlaceholder")}
            onChange={(e) => setInn(e.target.value)}
            error={
              !(/^\d{10}$/.test(inn) || /^\d{12}$/.test(inn)) &&
              t("commandPandel.input.innError")
            }
            // rightSection={
            //   getOrgInfoMutation.isPending && <Loader size={20} />
            // }
            rightSectionWidth={"60px"}
            rightSection={
              <ActionIcon.Group>
                <ActionIcon
                  size={28}
                  radius="sm"
                  color={"orange"}
                  variant="filled"
                  type="submit"
                >
                  <IconArrowRight size={18} stroke={1.5} />
                </ActionIcon>
                <ActionIcon
                  size={28}
                  radius="sm"
                  color={"gray"}
                  variant="filled"
                  onClick={handleReset}
                >
                  <IconArrowBackUp size={18} stroke={1.5} />
                </ActionIcon>
              </ActionIcon.Group>
            }
          />
        </form>
      ) : (
        <Button.Group>
          <Button
            leftSection={<IconPencil />}
            size="sm"
            variant={"default"}
            onClick={() => {
              setInn("");
              setInnInputVisible(true);
            }}
            loading={getOrgInfoMutation.isPending}
            // disabled
          >
            {t("commandPanel.inn")}
          </Button>
          <Button
            leftSection={<IconFilter />}
            size="sm"
            variant={"default"}
            // onClick={}
            disabled
          >
            {t("commandPanel.filter")}
          </Button>
          <Button
            leftSection={<IconZoom />}
            size="sm"
            variant={"default"}
            // onClick={}
            disabled
          >
            {t("commandPanel.search")}
          </Button>
        </Button.Group>
      )}
    </CommandPanelBase>
  );
}
