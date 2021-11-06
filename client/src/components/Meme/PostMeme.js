import Memes from "../Memes";
import React, { useState } from "react";
import { Collapse } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleUp,
  faAngleDoubleDown,
} from "@fortawesome/free-solid-svg-icons";

const PostMeme = () => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState([]);
  const [open, setOpen] = useState(false);

  const postMeme = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("username", localStorage.getItem("current-user"));

    try {
      fetch("http://localhost:5000/submit", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          setInterval(() => {
            window.location.pathname = data["redirect_path"];
          }, 1000);
        });
    } catch (err) {
      console.error(err.message);
    }
  };

  const checkInputForm = (e) => {
    switch (e.currentTarget.parentNode.id) {
      case "url-input-box":
        if (e.target.value !== "")
          document.getElementById("file-input-box").style.display = "none";
        else document.getElementById("file-input-box").style.display = "block";
        break;

      case "file-input-box":
        if (e.target.value !== "")
          document.getElementById("url-input-box").style.display = "none";
        else document.getElementById("url-input-box").style.display = "block";
        break;
      default:
    }
  };

  return (
    <>
      <div className="container">
        <Collapse in={open}>
          <div id="post-meme-form" className="container">
            <h3 className="mt-3 mb-4">Post Meme to kpopop</h3>
            <form encType="multpart/form-data" onSubmit={postMeme}>
              <div id="title-input-box" className="w-75 form-floating mb-3">
                <textarea
                  id="title-input"
                  type="input"
                  className="form-control"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <label className="title-input-label required-input">
                  title
                </label>
              </div>

              <div
                id="url-input-box"
                className="w-75 form-floating mb-3"
                style={{ display: `block` }}
              >
                <input
                  id="url-input"
                  type="url"
                  className="form-control"
                  name="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    checkInputForm(e);
                  }}
                />
                <label>url</label>
              </div>

              <div
                id="file-input-box"
                className="w-75 mb-3"
                style={{ display: `block` }}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="form-control"
                  name="images"
                  value={image}
                  onChange={(e) => {
                    setImage(e.target.value);
                    checkInputForm(e);
                  }}
                />
              </div>

              <div id="items-required" className="w-75 mb-3">
                {" "}
                is required
              </div>

              <div className="w-75 mb-4">
                <button className="btn btn-primary btn-sm">Post</button>
              </div>
            </form>
          </div>
        </Collapse>
      </div>

      <div className="container">
        <div className="row">
          <div className="col" style={{ textAlign: "center" }}>
            <button
              id="togglePostMeme"
              className="mt-3 mb-4 btn-light btn-sm shadow-none"
              onClick={() => setOpen(!open)}
              aria-controls="post-meme-form"
              aria-expanded={open}
            >
              {open ? "Hide Form" : "Show Form"}
              {open ? (
                <FontAwesomeIcon
                  style={{ marginLeft: "10" }}
                  icon={faAngleDoubleUp}
                />
              ) : (
                <FontAwesomeIcon
                  style={{ marginLeft: "10" }}
                  icon={faAngleDoubleDown}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      <Memes />
    </>
  );
};

export default PostMeme;
