import React from "react";

import { category } from "./Category";

import CategoryIcons from "./CategoryIcons";

function GiftCategory(props) {
  return (
    <>
      <div>
        <div
          id="touch-target"
          className="container mx-auto text-base flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu"
        >
          <a
            href="/giftlist/"
            className={
              props.cateno === ""
                ? "bg-indigo-50 text-black p-3 hover:bg-indigo-500 hover:text-white giftcategory"
                : "bg-white text-black p-3 hover:bg-indigo-500 hover:text-white giftcategory"
            }
          >
            <div>전체</div>
          </a>
          {category.map(cat => (
            <a
              href={`/giftlist/${cat.category1Seq}`}
              className={
                Number(props.cateno) === cat.category1Seq
                  ? "bg-indigo-50 text-gray-500 p-3 hover:bg-indigo-500 hover:text-white giftcategory"
                  : "bg-white text-gray-500 p-3 hover:bg-indigo-500 hover:text-white giftcategory"
              }
              key={cat.category1Seq}
            >
              <div className="flex flex-row flex-nowrap gap-1">
                <CategoryIcons num={cat.category1Seq} />
                {cat.category1Name}
              </div>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

export default GiftCategory;
