import { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { addNewServer } from "../../redux/server";
import styles from "./ServerNav.module.css";
import ServerIcon from "./components/ServerIcon";
import { AiFillFire } from "react-icons/ai";
import { CiCirclePlus } from "react-icons/ci";

const IMAGE_PLACEHOLDER = "https://t4.ftcdn.net/jpg/00/97/58/97/360_F_97589769_t45CqXyzjz0KXwoBZT9PRaWGHRk5hQqQ.jpg";

export default function ServerNav({ servers, setActiveServerId }) {
  const dispatch = useDispatch();

  const newServer = async (e) => {
    e.preventDefault();
    const server = {
      name: "Button Server",
      description: "This server was made by clicking a button",
      server_image: "not/a/url.jpg",
    };
    console.log("NEW SERVER", server);
    dispatch(addNewServer(server));
  };

  const serverElements = servers.map((server) => (
    <ServerIcon
      key={server.id}
      image={IMAGE_PLACEHOLDER}
      id={server.id}
      setActiveServerId={setActiveServerId}
    />
  ));

  return (
    <aside className={styles.serverNav}>
      <div className={styles.directMessageIcon}>
        <AiFillFire size={40} fill="orange" />
      </div>
      {serverElements}
      <button onClick={newServer}>
        <CiCirclePlus size={44} />
      </button>
    </aside>
  );
}
