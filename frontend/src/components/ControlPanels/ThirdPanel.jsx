import { useEffect, useRef } from "react";
import { useDnaContext } from "../../contexts/DnaContext";

const ThirdPanel = () => {
  const { images } = useDnaContext();

  const imagesArray = Object.values(images);

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (container) {
      const centerPosition =
        container.scrollWidth / 2 - container.clientWidth / 2;

      container.scrollLeft = centerPosition;
    }
  }, []);

  return (
    <>
      <div className="flex mt-5 items-center w-full justify-evenly flex-wrap gap-20">
        {imagesArray?.map((image, index) => {
          if (image != images.tree) {
            return (
              <img
                key={index}
                src={image}
                alt="compressed image"
                className="w-full max-w-[500px] rounded-md shadow-md"
              />
            );
          }
        })}
      </div>
      {imagesArray[imagesArray.length - 1] && (
        <div className="w-[97%] flex items-center justify-center mx-auto">
          <div ref={containerRef} className="w-[97%] h-[446.66px] overflow-x-auto shadow-lg mt-9 rounded-md">
            <img
              src={images.tree}
              alt="DNA tree"
              className="h-full min-w-[6015.33px]"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ThirdPanel;
