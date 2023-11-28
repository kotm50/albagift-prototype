import React from "react";
import {
  FaCoffee,
  FaBreadSlice,
  FaBabyCarriage,
  FaIceCream,
  FaPizzaSlice,
  FaCut,
  FaGift,
} from "react-icons/fa";
import { MdLocalConvenienceStore, MdRestaurant, MdMovie } from "react-icons/md";

function CategoryIcons(props) {
  return (
    <span className="categoryIcons">
      {props.num === 1 ? (
        <FaCoffee size={20} />
      ) : props.num === 2 ? (
        <FaBreadSlice size={20} />
      ) : props.num === 3 ? (
        <FaIceCream size={20} />
      ) : props.num === 4 ? (
        <MdLocalConvenienceStore size={20} />
      ) : props.num === 5 ? (
        <FaPizzaSlice size={20} />
      ) : props.num === 6 ? (
        <MdRestaurant size={20} />
      ) : props.num === 7 ? (
        <MdMovie size={20} />
      ) : props.num === 8 ? (
        <FaGift size={20} />
      ) : props.num === 9 ? (
        <FaCut size={20} />
      ) : props.num === 10 ? (
        <FaBabyCarriage size={20} />
      ) : null}
    </span>
  );
}

export default CategoryIcons;
