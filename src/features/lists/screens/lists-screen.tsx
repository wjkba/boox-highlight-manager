import { useLists } from "../hooks";
import { addList, deleteList, updateList } from "../api";
import { Link } from "react-router-dom";
import { BiSolidStar } from "react-icons/bi";
import { useState } from "react";
import ListOptions from "../components/list-options";
import Button from "@/components/ui/button";
import Page from "@/components/ui/page";
import {
  activeCardClasses,
  cardClasses,
  fieldClasses,
  pressableCardClasses,
  sectionTitleClasses,
} from "@/components/ui/styles";

const rowLinkClasses =
  `flex min-h-14 flex-1 items-center gap-2 p-4 text-lg ${pressableCardClasses}`;

interface ListProps {
  listId: number;
  listName: string;
}

export default function ListsPage() {
  const lists = useLists();
  const [isFormActive, setIsFormActive] = useState(false);
  const [activeOption, setActiveOption] = useState<number | null>(null);

  function List({ listId, listName }: ListProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [newName, setNewName] = useState(listName);

    function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
      setNewName(event.target.value);
    }
    async function handleEditConfirm(event: React.FormEvent) {
      event.preventDefault();
      if (newName.length > 0) {
        const result = await updateList(listId, { name: newName });
        console.log(result);
      }
    }

    function handleCancel() {
      setActiveOption(null);
      setIsEditing(false);
      setIsDeleting(false);
    }

    async function handleDeleteConfirm(event: React.FormEvent) {
      event.preventDefault();
      const result = await deleteList(listId);
      console.log(result);
      handleCancel();
    }

    if (isDeleting) {
      return (
        <div className={`${activeCardClasses} p-4`}>
          <p className="mb-4">Delete the list “{listName}”? Its highlights stay in your library.</p>
          <form onSubmit={handleDeleteConfirm} className="grid grid-cols-2 gap-2">
            <Button variant="ghost" onClick={handleCancel} text="Cancel" />
            <Button type="submit" text="Delete" />
          </form>
        </div>
      );
    }

    return (
      <div className={`flex items-start ${isEditing ? activeCardClasses : cardClasses}`}>
        {!isEditing ? (
          <>
            <Link to={`/lists/${listId}`} className={rowLinkClasses}>
              {listName}
            </Link>
            <div className="p-1.5">
              <ListOptions
                activeOption={activeOption}
                listId={listId}
                setActiveOption={setActiveOption}
                setIsEditing={setIsEditing}
                setIsDeleting={setIsDeleting}
              />
            </div>
          </>
        ) : (
          <form onSubmit={handleEditConfirm} className="grid w-full gap-4 p-4">
            <input
              aria-label="List name"
              value={newName}
              onChange={handleNameChange}
              className={fieldClasses}
            />
            <div className="grid grid-cols-2 gap-2">
              <Button variant="ghost" onClick={handleCancel} text="Cancel" />
              <Button type="submit" text="Save" />
            </div>
          </form>
        )}
      </div>
    );
  }

  function StarredList() {
    return (
      <div className={`flex ${cardClasses}`}>
        <Link to="/starred" className={rowLinkClasses}>
          <BiSolidStar size={20} aria-hidden="true" />
          Starred
        </Link>
      </div>
    );
  }

  function AddNewList() {
    const [newListName, setNewListName] = useState<string>("New list");

    function handleNewListNameChange(
      event: React.ChangeEvent<HTMLInputElement>
    ) {
      setNewListName(event.target.value);
    }

    function handleFormSubmit(event: React.FormEvent) {
      event.preventDefault();
      console.log(newListName);
      addList({ name: newListName, highlightIds: [] });
      setIsFormActive(false);
    }

    if (!isFormActive) {
      return (
        <Button
          text="New list"
          onClick={() => setIsFormActive(!isFormActive)}
          className="w-full sm:w-auto"
        />
      );
    }

    return (
      <form onSubmit={handleFormSubmit} className={`${activeCardClasses} grid gap-4 p-4`}>
        <h2 className={sectionTitleClasses}>New list</h2>
        <input
          type="text"
          aria-label="List name"
          className={fieldClasses}
          placeholder="List name"
          value={newListName}
          onChange={handleNewListNameChange}
        />
        <div className="grid grid-cols-2 gap-2">
          <Button variant="ghost" onClick={() => setIsFormActive(false)} text="Cancel" />
          <Button type="submit" text="Create list" />
        </div>
      </form>
    );
  }

  if (!lists || lists.length <= 0) {
    return (
      <Page title="Lists">
        <div className="mb-4">
          <StarredList />
        </div>
        <p className="mb-4">Group highlights into lists of your own. They will appear here.</p>
        <AddNewList />
      </Page>
    );
  }

  return (
    <Page title="Lists">
      <div className="mb-4 grid gap-2">
        <StarredList />
        {lists.map((list) => (
          <List listId={list.id} listName={list.name} key={list.id} />
        ))}
      </div>
      <AddNewList />
    </Page>
  );
}
