import { useDnaContext } from "../../contexts/DnaContext";

const RocPanel = () => {
    const { rocImages } = useDnaContext();
    const imagesArray = Object.values(rocImages);

    return (
        <div className="flex mt-5 items-center w-full justify-evenly flex-wrap gap-20">
            {imagesArray?.map((image, index) => (
                <img
                    key={index}
                    src={image}
                    alt="ROC/Confusion Matrix"
                    className="w-full max-w-[500px] rounded-md shadow-md"
                />
            ))}
        </div>
    );
};

export default RocPanel;
