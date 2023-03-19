import { useState, useEffect } from "react";

const TourGuideCard = ({ item, tgDeleted, handleDeleteTg }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const file = item?.profile_image.profile_data;
    if (file) {
      const data = new Uint8Array(
        atob(file.Data)
          .split("")
          .map((c) => c.charCodeAt(0))
      );
      const blob = new Blob([data], {
        type: "image/jpeg" || "image/png" || "image/jpg",
      });
      const url = URL.createObjectURL(blob);
      setImageUrl(url);
    }
  }, [item]);

  const [deleteTg, setDeleteTg] = useState(false);
  function toggleDeleteTgModal() {
    setDeleteTg((prev) => !prev);
  }

  return (
    <>
      {deleteTg && (
        <div className="bg-slate-800/80 w-full h-screen p-3 z-[100] fixed top-0 right-0 flex justify-center items-center">
          <div className="w-full md:w-[600px] p-8 bg-white rounded-md text-center">
            <img
              alt=""
              src="/images/icons8-box-important-50.png"
              className="w-14 h-14 mx-auto mb-4"
            />
            <p className="font-normalmb-2">
              Are you sure you want to remove{" "}
              <span className="font-medium">{item?.full_name}</span> as your
              tour guide?{" "}
            </p>

            <div className="w-full flex justify-between gap-5 items-center">
              <button
                onClick={toggleDeleteTgModal}
                className="bg-gray-400 text-white rounded-md px-8 py-2 mt-4"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleDeleteTg(item._id);
                  toggleDeleteTgModal();
                }}
                className="bg-blue-500 text-white rounded-md px-8 py-2 mt-4"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
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
        <div
          onClick={toggleDeleteTgModal}
          className="w-[20%] h-full flex justify-center items-center text-blue-400 border border-blue-400 rounded-2xl text-[.8rem] md:text-[.9rem] cursor-pointer"
        >
          Remove
        </div>
      </div>
    </>
  );
};

export default TourGuideCard;
