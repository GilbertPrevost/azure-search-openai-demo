import React, { useState } from "react";
import Modal from "react-modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./ratingmessage.module.css"

type Rating = "Neutral" | "Positive" | "Negative";
 interface Ratingmessageprops{
  ratings:string[];
  handleRatings: (rating: string[]) => void;
  index:number;
  ratings2 : [string,string][];

 };
 debugger;
export default function RatingComponent({
  
  ratings,
  handleRatings,
  index,
 ratings2,
 }:Ratingmessageprops){
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [rating, setRating] = useState<Rating>("Neutral");
  const [comment, setComment] = useState("");

  debugger
  console.log(index);

  const [ratingsfinal, setRatingsfinal] = useState<string[]>([]);
  const [sendratings, setSendRatings] = useState<string[]>([]);
ratings=[];

let Rating1:string[];
  
if(ratings2.length>0){
for(let i=0; i<ratings2.length; i++){
  Rating1 = ratings2[i];
   // setRatingsfinal(ratings2[i]) 
    
    if(parseInt(Rating1[2])==(index)){
      ratings=Rating1;
      
    }else{

    }

  }}


  const handleSubmit = async () => {
    // Create an object to store the rating and comment
    const ratingData = {
      rating,
      comment,
    };
    // Save the rating and comment as JSON
    const jsonData = JSON.stringify(ratingData);
  
    const ratings_1 = [rating,comment,''+index]
    handleRatings([rating,comment,''+index]);
    ratings=ratings_1;
    // Show the rating and comment in the console
   
  
    // Reset the rating and comment fields
    setModalIsOpen(false);

  };

  return (
    <div className={styles.ratings}>
      Satisfaction Rating&nbsp;
      <button
        onClick={() => setModalIsOpen(true)}
        className={styles.ratingsbutton}
      >
        <FontAwesomeIcon icon={faStar} />
      </button>

      {ratings.length > 0 && (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={() => setModalIsOpen(false)}
      style={{
        content: {
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%, -50%)",
          height: "225px",
          width: "350px",
          borderRadius:"15px",
        },
      }}
    >
      <div
        onClick={() => setModalIsOpen(false)}
        className={styles.ratingsmodal}
      >
        {/* <FontAwesomeIcon icon={faTimes} /> */}
      </div>
      <select
        value={ratings[0]}
        onChange={(e) => setRating(e.target.value as Rating)}
        className={styles.ratingsselect}
      >
        <option value="Neutral">Neutral</option>
        <option value="Positive">Positive</option>
        <option value="Negative">Negative</option>
      </select>
      <textarea
        value={ratings[1]}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Leave your comment here..."
        className={styles.ratingsTextarea}
      />
      <div className={styles.modal}>
        <button
          onClick={handleSubmit}
          className={styles.modalbutton}
        >
          Submit
        </button>{" "}
        <button
          onClick={() => setModalIsOpen(false)}
          className={styles.modalbutton}
        >
          Cancel
        </button>
      </div>
    </Modal>
  )}

      {ratings.length == 0 && (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            height: "225px",
            width: "350px",
            borderRadius:"15px",
          },
        }}
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className={styles.ratingsmodal}
        >
          {/* <FontAwesomeIcon icon={faTimes} /> */}
        </button>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value as Rating)}
          className={styles.ratingsselect}
        >
          <option value="Neutral">Neutral</option>
          <option value="Positive">Positive</option>
          <option value="Negative">Negative</option>
        </select>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave your comment here..."
          className={styles.ratingsTextarea}
        />
        <div className={styles.modal}>
          <button
            onClick={handleSubmit}
            className={styles.modalbutton}
          >
            Submit
          </button>{" "}
          <button
            onClick={() => setModalIsOpen(false)}
            className={styles.modalbutton}
          >
            Cancel
          </button>
        </div>
      </Modal>
      )}
    </div>
  );
};

