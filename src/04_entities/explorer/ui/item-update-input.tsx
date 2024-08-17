import { useState } from "react";
import { explorerSlice } from "../model";
import { dataForUpdate, explorerItemId, explorerItems } from "../api/types";
import { useAppDispatch, useAppSelector } from "src/05_shared/redux";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { updateExplorerItem } from "../api/explorer-api";
import { queryClient } from "src/05_shared/api";

export function ExplorerItemUpdateInput({
  id,
  name,
  setIsUpdating,
  updateMutation,
}: {
  id: explorerItemId;
  name: string;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  updateMutation: UseMutationResult<
    {
      id: number;
      name: string;
      children?: number[];
      category: "file" | "folder" | null;
      parentId: number | null;
    },
    Error,
    dataForUpdate,
    unknown
  >;
}) {
  const [inputValue, setInputValue] = useState(name);

  function handleBlur() {
    setIsUpdating(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateMutation.mutate({ id, name: inputValue });
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          autoFocus
          required
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          onBlur={handleBlur}
        />
      </form>
    </>
  );
}
