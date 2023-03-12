import { useState, useEffect } from "react";

const TourGuideCard = ({ item }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const file = item?.profile_image?.profile_image;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const blob = new Blob([reader.result], {
          type: "image/jpeg" || "image/png" || "image/jpg",
        });
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      };
      reader.readAsBinaryString(new Blob([file]));
    }
  }, [item]);

  return (
    <div className="w-full h-[50px] md:h-[70px] flex gap-2 items-center">
      <div className="w-[80%] md:w-[85%] px-3 md:px-5 py-2 border rounded-md flex items-center gap-3 md:gap-6">
        <img
          alt=""
          src={imageUrl}
          className="w-8 md:w-14 h-8 md:h-14 rounded-full object-cover border border-blue-400"
        />
        <p className="font-normal text-[0.85rem] md:text-[1rem]">
          {item?.full_name}
        </p>
      </div>
      <div className="w-[20%] h-full flex justify-center items-center text-blue-400 border border-blue-400 rounded-2xl text-[.8rem] md:text-[.9rem]">
        Remove
      </div>
    </div>
  );
};

export default TourGuideCard;
