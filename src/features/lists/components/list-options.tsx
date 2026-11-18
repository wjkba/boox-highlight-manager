import { iconButtonClasses, menuClasses, menuItemClasses } from "@/components/ui/styles";
import { BiDotsVerticalRounded, BiSolidTrash, BiEditAlt } from "react-icons/bi";

interface ListOptionsProps {
  listId: number;
  activeOption: number | null;
  setActiveOption: (listId: number | null) => void;
  setIsEditing: (b: boolean) => void;
  setIsDeleting: (b: boolean) => void;
}

export default function ListOptions({
  listId,
  activeOption,
  setActiveOption,
  setIsEditing,
  setIsDeleting,
}: ListOptionsProps) {
  const isActive = activeOption === listId;

  const cardOptions = [
    {
      text: "Rename list",
      action: () => handleRenameList(),
      icon: <BiEditAlt />,
    },
    {
      text: "Delete list",
      action: () => handleDeleteList(),
      icon: <BiSolidTrash />,
    },
  ];

  function handleOpen() {
    if (activeOption) {
      setActiveOption(null);
    } else {
      setActiveOption(listId);
    }
  }

  function handleRenameList() {
    setIsEditing(true);
  }

  function handleDeleteList() {
    setIsDeleting(true);
  }

  return (
    <div className={`card-options relative ${isActive && "open"}`}>
      <button type="button" aria-label={`${isActive ? "Close" : "Open"} list options`} aria-expanded={isActive} className={iconButtonClasses} onClick={handleOpen}>
        <BiDotsVerticalRounded size={24} aria-hidden="true" />
      </button>
      <ul className={menuClasses}>
        {isActive &&
          cardOptions.map((option) => (
            <li
              key={option.text}>
              <button type="button" onClick={option.action} className={menuItemClasses}>
                {option.icon}
                {option.text}
              </button>
            </li>
          ))}
      </ul>
    </div>
  );
}
