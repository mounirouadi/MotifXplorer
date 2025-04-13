import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useDnaContext } from "../../../contexts/DnaContext";
const animatedComponents = makeAnimated();

const Options = () => {
  const { setKmer, kmer } = useDnaContext();

  const kmerOptions = [
    { value: 3, label: "3" },
    { value: 4, label: "4" },
    { value: 5, label: "5" },
    { value: 6, label: "6" },
    { value: 7, label: "7" },
    { value: 8, label: "8" },
    { value: 9, label: "9" },
    { value: 10, label: "10" },
  ];

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      cursor: "pointer",
      borderRadius: "5px",
      margin: "5px 8px",
      maxWidth: "calc(100% - 16px)",
    }),
  };

  return (
    <div className="flex gap-4 w-[500px]">
      <div className="flex flex-col gap-4 w-full">
        <div className="kmer-select flex-1 ">
          <label
            htmlFor="kmer"
            className="uppercase ml-1 font-semibold text-gray-500"
          >
            K-mer
          </label>
          <Select
            styles={customStyles}
            className="w-full mt-1"
            id="kmer"
            components={animatedComponents}
            isMulti
            onChange={(e) => setKmer(e.map((opt) => opt.value))}
            value={kmer?.map((k) => ({ value: k, label: k }))}
            isClearable={true}
            isSearchable={true}
            options={kmerOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
