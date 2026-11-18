import { iconButtonClasses, menuClasses, menuItemClasses } from "@/components/ui/styles";
import { BiDotsVerticalRounded, BiSolidTrash, BiEditAlt } from "react-icons/bi";

interface ListOptionsProps {
  bookId: number;
  activeOption: number | null;
  setActiveOption: (bookId: number | null) => void;
  setIsEditing: (b: boolean) => void;
  setIsDeleting: (b: boolean) => void;
}

export default function BookOptions({
  bookId,
  activeOption,
  setActiveOption,
  setIsEditing,
  setIsDeleting,
}: ListOptionsProps) {
  const isActive = activeOption === bookId;

  const cardOptions = [
    {
      text: "Edit book info",
      action: () => handleEditBookInfo(),
      icon: <BiEditAlt />,
    },

    {
      text: "Delete book",
      action: () => handleDeleteBook(),
      icon: <BiSolidTrash />,
    },
  ];

  function handleOpen() {
    if (activeOption) {
      setActiveOption(null);
    } else {
      setActiveOption(bookId);
    }
  }

  function handleEditBookInfo() {
    setIsEditing(true);
  }

  function handleDeleteBook() {
    setIsDeleting(true);
  }

  return (
    <div className={`card-options relative ${isActive && "open"}`}>
      <button type="button" aria-label={`${isActive ? "Close" : "Open"} book options`} aria-expanded={isActive} className={iconButtonClasses} onClick={handleOpen}>
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
