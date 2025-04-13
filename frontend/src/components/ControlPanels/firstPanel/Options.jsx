import Select from "react-select";
import { useDnaContext } from "../../../contexts/DnaContext";
import { useEffect, useState } from "react";

const Options = () => {
  const { setBedFile,bedFile, setReferenceGenome,referenceGenome } = useDnaContext();


  const bedFileOptions = [
    { value: 1, label: "Positive" },
    { value: 2, label: "Positive and Negative" },
  ];
  const referenceGenomeOptions = [
    { value: 1, label: "hg19" },
    { value: 2, label: "hg38" },
    { value: 3, label: "MM9" },
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
        <div className="library-select flex-1 ">
          <label
            htmlFor="library"
            className="uppercase ml-1 font-semibold text-gray-500"
          >
            BED File
          </label>
          <Select
            styles={customStyles}
            className="library w-full mt-1"
            id="library"
            onChange={(e) => setBedFile(e.value)}
            isClearable={true}
            isSearchable={true}
            options={bedFileOptions}
            value={bedFileOptions[bedFile - 1]}
          />
        </div>
        <div className="mc-select flex-1">
          <label
            htmlFor="mc"
            className="uppercase ml-1 font-semibold text-gray-500"
          >
            Reference Genome
          </label>
          <Select
            styles={customStyles}
            className="library w-full mt-1"
            id="mc"
            onChange={(e) => setReferenceGenome(e.value)}
            isClearable={true}
            isSearchable={true}
            options={referenceGenomeOptions}
            value={referenceGenomeOptions[referenceGenome - 1]}
          />
        </div>
      </div>
    </div>
  );
};

export default Options;
