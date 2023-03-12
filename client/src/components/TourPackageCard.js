const TourPackageCard = ({ item }) => {
  return (
    <div className="w-full block sm:flex justify-between bg-gray-200/60 p-3 rounded-md mb-4 cursor-pointer">
      <div className="info">
        <h2 className="font-medium">Title</h2>
        <p>{item?.title}</p>
      </div>
      <div className="info">
        <h2 className="font-medium">Bookings</h2>
        <p>0</p>
      </div>
      <div className="info">
        <h2 className="font-medium">No of tourists</h2>
        <p>0</p>
      </div>
      <div className="info">
        <h2 className="font-medium">Status</h2>
        <p>In review</p>
      </div>
    </div>
  );
};

export default TourPackageCard;
