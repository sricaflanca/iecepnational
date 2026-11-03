import { useState } from "react";

// Helpers for listing pages whose cards show a short preview and open the
// full write-up in a dialog (see components/WriteUpDialog.jsx).

// Keeps the last-opened item around while the dialog's close animation
// plays, so the content doesn't blank out mid-fade.
export function useWriteUp() {
  const [item, setItem] = useState(null);
  const [open, setOpen] = useState(false);
  return {
    item,
    open,
    show: (it) => {
      setItem(it);
      setOpen(true);
    },
    close: () => setOpen(false),
  };
}

// Makes a card (a div, so it can hold headings/images) behave as a button:
// click, plus Enter/Space from the keyboard. Keystrokes that originate from
// a link or button inside the card are left alone.
export function clickableCardProps(onOpen) {
  return {
    role: "button",
    tabIndex: 0,
    onClick: onOpen,
    onKeyDown: (e) => {
      if (e.target !== e.currentTarget) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    },
  };
}

export const CARD_CLICK_CLASSES =
  "cursor-pointer focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-azure";
