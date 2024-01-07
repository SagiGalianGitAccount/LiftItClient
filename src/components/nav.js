import React, { Component, useEffect, useState } from "react";
import "../static/css/nav.css"; //
import { RiMore2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoMdDoneAll } from "react-icons/io";
import { FcAssistant, FcInfo, FcSettings } from "react-icons/fc";
import { FiInstagram } from "react-icons/fi";
import { TbBrandTiktok } from "react-icons/tb";
import { VscBellDot, VscBell } from "react-icons/vsc";
import { FaWindowClose } from "react-icons/fa";
import Contact from "../pages/contact";
import Explanation from "../pages/explanation";
import Settings from "../pages/settings";
import axios from "axios";
import { backendUrl } from "./urlConnector";
import PropagateLoader from "react-spinners/PropagateLoader";
import { motion } from "framer-motion";

function Nav() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [contacting, setContacting] = useState(false);
  const [explanation, setExplanation] = useState(false);
  const [inUpdates, setInUpdates] = useState(false);
  const [inSettings, setInSettings] = useState(false);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    getUpdates();
  }, []);
  const getUpdates = () => {
    axios
      .get(backendUrl + "getUpdates")
      .then((result) => {
        setUpdates(result.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div>
      <div
        id="scroller"
        className="nav"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            onClick={() => {
              setInUpdates((current) => !current);
            }}
            style={{ marginLeft: 10 }}
          >
            <VscBellDot
              id="clickable"
              size={30}
              onClick={() => {
                localStorage.setItem("notified", true);
              }}
            />
          </div>
          <div id="scroller">
            <h1 style={{ marginLeft: 25 }}>
              {localStorage.getItem("accountName")}
            </h1>
          </div>
        </div>
        <RiMore2Fill
          id="clickable"
          size={30}
          onClick={() => {
            setOpen((current) => !current);
          }}
        />
      </div>

      {contacting && <Contact setContacting={setContacting} />}
      {explanation && <Explanation setExplanation={setExplanation} />}
      {inSettings && <Settings setInSettings={setInSettings} />}

      {inUpdates && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ rotate: 360, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
        >
          <div className="inupdate">
            {updates.map((update) => (
              <h1 key={update} style={{ fontSize: 22 }}>
                {update}
              </h1>
            ))}

            <IoMdDoneAll
              className="editicon"
              size={30}
              color="green"
              onClick={() => {
                setInUpdates((current) => !current);
              }}
            />
          </div>
        </motion.div>
      )}
      {true && (
        <motion.div
          className={`sidebar ${open ? "open" : ""}`}
          initial={{ x: -300 }}
          animate={{ x: open ? 0 : -300 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <PropagateLoader size={10} />
          </div>
          <div className="nav-btns">
            <div
              className="inline-div-button-title"
              onClick={() => {
                setOpen(false);
                setContacting(false);
                setExplanation(false);
                setInSettings(false);
                localStorage.clear();
                navigate("/login");
              }}
            >
              <RiLogoutBoxRLine
                style={{
                  border: "2px solid #d8315b",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                color="#d8315b"
                size={40}
              />
              <h6>Log Out</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setContacting(true);
                setOpen(false);
                setExplanation(false);
                setInSettings(false);
              }}
            >
              <FcAssistant
                style={{
                  border: "2px solid orange",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Contact Us</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setExplanation(true);
                setOpen(false);
                setInSettings(false);
                setContacting(false);
              }}
            >
              <FcInfo
                style={{
                  border: "2px solid #fffaff",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Information</h6>
            </div>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setOpen(false);
                setInSettings(true);
                setExplanation(false);
                setContacting(false);
              }}
            >
              <FcSettings
                style={{
                  border: "2px solid #808080",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Settings</h6>
            </div>{" "}
            <a
              href="https://instagram.com/lift_it_make_a_progress?igshid=YmMyMTA2M2Y="
              target="_blank"
              style={{ color: "black", textDecoration: "none" }}
              className="inline-div-button-title"
            >
              <FiInstagram
                style={{
                  border: "2px solid #833AB4",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
                color="#833AB4"
              />
              <h6>Instagram</h6>
            </a>
            <a
              href="https://www.tiktok.com/@lift_it_make_a_progress?_t=8bjYqniL5Sk&_r=1"
              target="_blank"
              style={{ color: "black", textDecoration: "none" }}
              className="inline-div-button-title"
            >
              <TbBrandTiktok
                style={{
                  border: "2px solid black",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
                color="black"
              />
              <h6>Tiktok</h6>
            </a>
            <div
              className="inline-div-button-title"
              onClick={() => {
                setOpen(false);
              }}
            >
              <FaWindowClose
                color="#1E2952"
                style={{
                  border: "2px solid #1E2952",
                  padding: 5,
                  borderRadius: 28,
                  marginRight: 10,
                }}
                size={40}
              />
              <h6>Close</h6>
            </div>
            
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default Nav;
