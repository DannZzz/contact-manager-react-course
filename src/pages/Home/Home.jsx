import React, { useContext, useState } from "react";
import Contact from "../../Contact/Contact";
import ContactHead from "../../Contact/ContactHead";
import "./Home.scss";
import { SettingsContext } from "../../Context/SettingsContext";
import ContactCard from "../../Contact/ContactCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useFetch from "../../hooks/useFetch";
import { ErrorContext } from "../../Context/ErrorContext";

const Home = ({ list, setList, selects, setSelects }) => {
  const isEdit = useState(false);
  const { request } = useFetch();
  const { settings } = useContext(SettingsContext);
  const { dispatchError } = useContext(ErrorContext);

  function onRemove(id) {
    request("/list/delete", { method: "DELETE", query: { ids: id } }).then(
      (res) => {
        if (res.status === "OK") setList(list.filter((item) => item.id !== id));
      }
    );
  }
  const showList = settings.search.query
    ? list.filter((contact) =>
        settings.search.type !== "name"
          ? contact?.[settings.search.type]
              .toLowerCase()
              .includes(settings.search.query.toLowerCase())
          : `${contact.firstName.toLowerCase()} ${contact.lastName.toLowerCase()}`.includes(
              settings.search.query.toLowerCase()
            )
      )
    : list;

  function onSelectChange(id, checked) {
    const has = selects.includes(id);
    if (checked && !has) {
      setSelects([...selects, id]);
    } else if (!checked && has) {
      setSelects(selects.filter((sl) => sl !== id));
    }
  }

  function onValuesSave(id, contact, onOk) {
    const entries = Object.entries(contact);
    for (let index = 0; index < entries.length; index++) {
      const element = entries[index];
      if (element[0] === "phone") {
        if (!element[1].filter((x) => x).length) {
          return dispatchError(
            "At least one phone number must be specified",
            2000
          );
        }
      }
    }
    const index = list.findIndex((cnt) => cnt.id === id);
    const clone = [...list];
    const form = new FormData();
    Object.keys(contact).forEach((key) => {
      if (!["avatar", "id", "phone"].includes(key))
        form.append(key, contact[key]);
    });
    if (contact.avatar && typeof contact.avatar !== "string")
      form.append("avatar", contact.avatar);

    contact.phone.forEach((phone) => {
      phone && form.append("phone[]", phone);
    });

    request("/list/edit/" + id, { method: "PUT", body: form }).then((res) => {
      if (res?.status === "OK") {
        clone[index] = res.data;
        setList(clone);
        onOk?.();
      }
    });
  }

  async function onContactRequest(data, onOk) {
    if (Object.values(data).some((v) => !v)) return;
    const form = new FormData();
    form.append("firstName", data.firstName);
    form.append("lastName", data.lastName);
    form.append("email", data.email);
    form.append("phone", data.phone);
    form.append("profession", data.profession);

    if (data?.avatar && typeof data.avatar !== "string")
      form.append("avatar", data.avatar);
    await request("/list/create", {
      method: "POST",
      body: form,
    }).then((res) => {
      if (res?.status === "OK") {
        onOk?.();
        setList([...list, { ...res.data }]);
      }
    });
  }

  function onAllSelectChange(bool) {
    bool ? setSelects(list.map((cnt) => cnt.id)) : setSelects([]);
  }

  function deleteSelected() {
    if (!selects.length) return;
    request("/list/delete", {
      method: "DELETE",
      query: { ids: selects.join(",") },
    }).then((res) => {
      if (res.status === "OK") {
        setList(list.filter((cnt) => !selects.includes(cnt.id)));
        setSelects([]);
      }
    });
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(list, result.source.index, result.destination.index);

    setList(items);
  }

  return (
    <div className="contact-list">
      <ContactHead
        deleteSelected={deleteSelected}
        selectsLength={selects.length}
        isSelected={list.length > 0 && list.length === selects.length}
        onAllSelectChange={onAllSelectChange}
        onContactRequest={onContactRequest}
      />
      {settings.cardView ? (
        <div className="contact-list-card">
          {showList.map((contact) => (
            <ContactCard
              onValuesSave={onValuesSave}
              onSelectChange={onSelectChange}
              onRemove={onRemove}
              isSelected={selects.includes(contact.id)}
              key={contact.id}
              contact={contact}
            />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd} className="lol">
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {showList.map((contact, index) => (
                  <Draggable
                    key={contact.id}
                    draggableId={contact.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <Contact
                        reff={provided}
                        isEdit={isEdit}
                        onValuesSave={onValuesSave}
                        onSelectChange={onSelectChange}
                        onRemove={onRemove}
                        isSelected={selects.includes(contact.id)}
                        contact={contact}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default Home;
