import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { contextMenuModel } from "..";

export function useCoordsContextMenu({
  isShowed,
  contextMenuRef,
  position,
}: {
  isShowed: boolean;
  contextMenuRef: React.MutableRefObject<HTMLDivElement | null>;
  position: {
    x: number;
    y: number;
  };
}) {
  const dispatch = useDispatch();
  useEffect(() => {
    if (isShowed && contextMenuRef.current) {
      const { x, y } = position;
      const rootW = contextMenuRef.current.offsetWidth;
      const rootH = contextMenuRef.current.offsetHeight;
      const screenW = window.innerWidth;
      const screenH = window.innerHeight;

      let newX = x;
      let newY = y;

      if (x + rootW > screenW) {
        newX = screenW - rootW;
      }

      if (y + rootH > screenH) {
        newY = screenH - rootH;
      }

      if (newX !== x || newY !== y) {
        dispatch(contextMenuModel.setCoords({ x: newX, y: newY }));
      }
    }
  });
}


export function useHideContextMenu() {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClick = () => dispatch(contextMenuModel.hideContextMenu());
    const handleWindowBlur = () => dispatch(contextMenuModel.hideContextMenu());
    document.addEventListener("click", handleClick);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("click", handleClick);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, []);
}