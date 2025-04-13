import { useDnaContext } from "../../../contexts/DnaContext";
import Notes from "./Notes";
import Options from "./Options";

const FirstPanel = ({ handleProcess }) => {
  const { loading, bedFile, maxFileSize } = useDnaContext();

  return (
    <div className="drop-shadow-lg bg-gray-100 px-4 py-7 rounded-md">
      <Options />
      {/* <Notes bedFile={bedFile} maxFileSize={maxFileSize} /> */}
      <div className="flex mt-5 items-center gap-4">
        <button
          className={`flex items-center gap-3 px-5 py-2 rounded-md bg-blue-500 duration-300 hover:opacity-90 active:scale-[.98] ${
            loading ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleProcess}
        >
          <i className="fa-solid fa-down-left-and-up-right-to-center text-white"></i>
          <p className="text-white">Process</p>
        </button>
      </div>
    </div>
  );
};

export default FirstPanel;
