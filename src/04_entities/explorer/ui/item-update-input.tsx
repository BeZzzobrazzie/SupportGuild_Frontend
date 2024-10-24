import { useState } from "react";
import { explorerSlice } from "../model";
import { dataForUpdate, explorerItemId, explorerItems } from "../api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { updateExplorerItem } from "../api/explorer-api";
import { queryClient } from "src/05_shared/api";
import { useUpdateMutation } from "../lib/mutations";
import classes from "./explorer-item.module.css";
import { TextInput } from "@mantine/core";

export function ExplorerItemUpdateInput({
  id,
  name,
  setIsUpdating,
}: {
  id: explorerItemId;
  name: string;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [inputValue, setInputValue] = useState(name);
  const updateMutation = useUpdateMutation(setIsUpdating);

  function handleBlur() {
    setIsUpdating(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMutation.mutate({ id, name: inputValue });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={classes["explorer-item__form"]}>
        <TextInput
          classNames={{
            input: classes["explorer-item__input"],
          }}
          autoFocus
          required
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={handleBlur}
          // variant="unstyled"
          size="xs"
        />
      </form>
    </>
  );
}
