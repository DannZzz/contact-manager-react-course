import React, { useContext, useState, useEffect } from "react";
import Contact from "../../Contact/Contact";
import ContactHead from "../../Contact/ContactHead";
import "./Home.scss";
import { SettingsContext } from "../../Context/SettingsContext";
import ContactCard from "../../Contact/ContactCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import useFetch from "../../hooks/useFetch";
import { ErrorContext } from "../../Context/ErrorContext";

const Home = () => {
  const [list, setList] = useState([]);
  const [selects, setSelects] = useState([]);
  const isEdit = useState(false);
  const { request } = useFetch();
  const { settings } = useContext(SettingsContext);
  const { dispatchError } = useContext(ErrorContext);

  useEffect(() => {
    request("/list/get").then((res) => {
      if (res.data) setList(res.data);
    });

    const savedSelects = localStorage.getItem("savedSelects")?.split(",") || [];
    setSelects(savedSelects.filter((f) => f));
  }, []);

  useEffect(() => {
    localStorage.setItem("savedSelects", selects.join(","));
  }, [selects]);

  const showList = settings.search.query
    ? list.filter((contact) => {
        switch (settings.search.type) {
          case "name":
            return `${contact.firstName.toLowerCase()} ${contact.lastName.toLowerCase()}`.includes(
              settings.search.query.toLowerCase()
            );

          case "phone":
            return contact.phone.some((ph) =>
              ph.includes(settings.search.query.toLowerCase())
            );

          default:
            return contact?.[settings.search.type]
              .toLowerCase()
              .includes(settings.search.query.toLowerCase());
        }
      })
    : list;

  function onRemove(id) {
    request("/list/delete", { method: "DELETE", query: { ids: id } }).then(
      (res) => {
        if (res.status === "OK") setList(list.filter((item) => item.id !== id));
      }
    );
  }

  function onSelectChange(id, checked) {
    const has = selects.includes(id);
    if (checked && !has) {
      setSelects([...selects, id]);
    } else if (!checked && has) {
      setSelects(selects.filter((sl) => sl !== id));
    }
  }

  function onValuesSave(id, contact, onOk) {
    const invalidMessage = invalidDataMessage(contact);
    if (invalidMessage) return dispatchError(invalidMessage, 2000);
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
    if (Object.values(data).some((v) => !v || (Array.isArray(v) && !v.length)))
      return;
    console.log(data);
    const invalidMessage = invalidDataMessage(data);
    if (invalidMessage) return dispatchError(invalidMessage, 2000);

    const form = new FormData();
    form.append("firstName", data.firstName);
    form.append("lastName", data.lastName);
    form.append("email", data.email);
    data.phone?.forEach((phone) => form.append("phone[]", phone));
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

function invalidDataMessage(contact) {
  const opts = ["firstName", "lastName", "email", "phone", "profession"];
  for (let i = 0; i < opts.length; i++) {
    const key = opts[i];
    const element = contact[key];

    if (key === "firstName" && !element) {
      return "First name was not specified";
    } else if (key === "lastName" && !element) {
      return "Last name was not specified";
    } else if (key === "email" && !element) {
      return "Email was not specified";
    } else if (key === "phone") {
      if (!element?.filter((x) => x).length) {
        return "At least one phone number must be specified";
      }
    } else if (key === "profession" && !element) {
      return "Profession was not specified";
    }
  }
  return "";
}
