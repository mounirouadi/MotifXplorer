import { useEffect, useState } from "react";
import FileUpload from "./FileUpload";
import Options from "./ControlPanels/firstPanel/Options";
import axios from "axios";
import { useDnaContext } from "../contexts/DnaContext";
import { toast } from "react-hot-toast";
import FirstPanel from "./ControlPanels/firstPanel/FirstPanel";
import SecondPanel from "./ControlPanels/secondPanel/SecondPanel";
import ThirdPanel from "./ControlPanels/ThirdPanel";
import RocPanel from "./ControlPanels/RocPanel";
import Select from "react-select";
import Modal from "react-modal";
import BouncingDots from "./DnaLoader";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "90%",
    maxWidth: "650px",
    minHeight: "200px",
    height: "max-content",
    maxHeight: "700px",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "15px 15px",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
};

const customSelectStyles = {
  option: (provided, state) => ({
    ...provided,
    cursor: "pointer",
    borderRadius: "5px",
    margin: "5px 8px",
    maxWidth: "calc(100% - 16px)",
  }),
};

Modal.setAppElement("#root");

let subtitle = { style: {} };

const Main = () => {
  const {
    bedFile,
    referenceGenome,
    maxFileSize,
    loading,
    setLoading,
    uploadedFiles,
    setCsv,
    kmer,
    setImages,
    csv,
    images,
    rocImages,
    setRocImages,
  } = useDnaContext();
  const [panelNumber, setPanelNumber] = useState(0);
  const [modalIsOpen, setIsOpen] = useState(false);
  const [generatedDetails, setGeneratedDetails] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [sessionDir, setSessionDir] = useState(null);

  const openModal = () => {
    setIsOpen(true);
  };
  const afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  };

  function closeModal() {
    setIsOpen(false);
  }

  const [features, setFeatures] = useState(null);
  const [types, setTypes] = useState(null);

  const featuresOptions = [
    { value: 3, label: "3" },
    { value: 5, label: "5" },
    { value: 10, label: "10" },
    { value: 20, label: "20" },
  ];
  const typesOptions = [
    {
      value: "weight",
      label: "Weight",
    },
    {
      value: "gain",
      label: "Gain",
    },
    {
      value: "cover",
      label: "Cover",
    },
    {
      value: "total_gain",
      label: "Total Gain",
    },
    {
      value: "total_cover",
      label: "Total Cover",
    },
  ];

  const handleProcess = async () => {
    if (loading) return toast.error("Please wait for the process to finish");
    if (!bedFile) return toast.error("Please select a bed file type");
    if (!referenceGenome)
      return toast.error("Please select a reference genome");
    if (!uploadedFiles || !uploadedFiles.length)
      return toast.error("Please upload a file");

    setLoading(true);
    setProcessing(true);

    try {
      if (panelNumber == 0) {
        const formData = new FormData();
        uploadedFiles.forEach((file) => {
          formData.append("files", file);
        });
        formData.append("bedFile", bedFile);
        formData.append("referenceGenome", referenceGenome);
        const { data } = await axios.post(
          "/api/process",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setCsv(data);
        setSessionDir(data.session_dir);
      } else if (panelNumber == 1) {
        const formData = new FormData();
        formData.append("kmer", kmer);
        formData.append("session_dir", sessionDir);
        const { data } = await axios.post("/api/kmer",
          formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setRocImages(data);
      }

      setPanelNumber((oldState) => {
        if (oldState < 2) return oldState + 1;
      });
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
      setProcessing(false);
    }
  };

  const handleDetails = async () => {
    if (loading) return toast.error("Please wait for the process to finish");
    if (!features) return toast.error("Please select a number of features");
    if (!types) return toast.error("Please select a type");

    setLoading(true);
    const formData = new FormData();
    formData.append("features", features);
    formData.append("types", JSON.stringify(types));
    formData.append("session_dir", sessionDir);
    const { data } = await axios.post("/api/analysis",
      formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    setImages(data);
    setGeneratedDetails(true);
    setPanelNumber(3);
    setLoading(false);
    closeModal();
  };

  const backgroundGardient = {
    backgroundImage:
      "linear-gradient(to right, var(--primary-1), var(--primary-2))",
  };
  const PageHeader = () => {
    switch (panelNumber) {
      case 2: {
        return (
          <>
            <div className="flex justify-between items-center w-[96%] px-1 mt-[5px]">
              <h1 className="text-3xl text-gray-700 font-semibold text-center mb-3">
                ROC & Confusion Matrix
              </h1>
              <button
                onClick={openModal}
                className="px-6 py-2 text-white rounded-md capitalize leading-[2.2] duration-300 hover:scale-95"
                style={backgroundGardient}
              >
                Generate Post Training Report
              </button>
            </div>
            <div className="h-[1px] w-[96%] mt-4 bg-gray-300" />
          </>
        );
      }
      case 3: {
        return (
          <>
            <div className="flex justify-between items-center w-[96%] px-1 mt-[5px]">
              <h1 className="text-3xl text-gray-700 font-semibold text-center mb-3">
                Post Training Report
              </h1>
            </div>
            <div className="h-[1px] w-[96%] mt-4 bg-gray-300" />
          </>
        );
      }

      default: {
        return (
          <div>
            <h1 className="text-3xl text-gray-700 font-semibold text-center mb-3">
              Genomic Peak Analysis Web Tool
            </h1>
            <p className="max-w-[550px] text-gray-800 text-center">
              a user-friendly platform designed for non-machine learning
              professionals to analyze ChIP-seq peaks and gain insights into DNA
              sequences associated with those peaks.
            </p>
          </div>
        );
      }
    }
  };

  const Panel = ({ panelNumber }) => {
    switch (panelNumber) {
      case 0:
        return <FirstPanel handleProcess={handleProcess} />;
      case 1:
        return <SecondPanel handleProcess={handleProcess} />;
      case 2:
        return <RocPanel />;
      case 3:
        return <ThirdPanel />;
      default:
        <FirstPanel handleProcess={handleProcess} />;
    }
  };

  const handleBack = () => {
    setPanelNumber((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setPanelNumber((prev) => Math.min(3, prev + 1));
  };

  const canGoNext = () => {
    if (panelNumber === 0 && csv) return true;
    if (panelNumber === 1 && rocImages && Object.keys(rocImages).length > 0) return true;
    if (panelNumber === 2 && images && Object.keys(images).length > 0) return true;
    return false;
  };

  return (
    <>
      <div className="w-full flex justify-between px-4 mt-4">
        <div>
          {panelNumber > 0 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              <i className="fas fa-arrow-left"></i> Back
            </button>
          )}
        </div>
        <div>
          {canGoNext() && (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
            >
              Next <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
      {<PageHeader />}
      <div
        className="flex flex-row w-full justify-center flex-wrap items-center gap-10 px-2"
        style={{ marginTop: "50px" }}
      >
        {panelNumber <= 1 && (
          <div className="files flex justify-center items-center flex-wrap gap-[50px] lg:gap-[100px] w-f">
            <p className="max-w-[550px] text-gray-800 text-center"> </p>
            {processing ? (
              <BouncingDots />
            ) : (
              <FileUpload />
            )}
            <p className="max-w-[550px] text-gray-800 text-center"> </p>
          </div>
        )}
        <Panel panelNumber={panelNumber} />
      </div>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div
          className="flex justify-between items-center w-full px-1 mt-[1px] border-b border-gray-300"
          style={{ borderBottomStyle: "solid" }}
        >
          <p className="text-[23px] text-gray-700 font-semibold text-center mb-3">
            Generate Post Training Report
          </p>
          <button onClick={closeModal}>
            <i className="fas fa-times text-gray-700 text-[23px]"></i>
          </button>
        </div>
        <div className="flex flex-col gap-4 w-full mt-4">
          <div className="library-select flex-1 ">
            <label
              htmlFor="library"
              className="uppercase ml-1 font-semibold text-gray-500"
            >
              Number of features *
            </label>
            <Select
              styles={customStyles}
              className="library w-full mt-1"
              id="library"
              onChange={(e) => setFeatures(e.value)}
              isClearable={true}
              isSearchable={true}
              options={featuresOptions}
            />
          </div>
          <div className="mc-select flex-1">
            <label
              htmlFor="mc"
              className="uppercase ml-1 font-semibold text-gray-500"
            >
              Important types *
            </label>
            <Select
              styles={customStyles}
              className="library w-full mt-1"
              id="mc"
              onChange={(e) => setTypes(e.map((opt) => opt.value))}
              isClearable={true}
              isSearchable={true}
              isMulti={true}
              options={typesOptions}
            />
          </div>
        </div>
        <div className="flex justify-start items-center w-full mt-6">
          <button
            onClick={handleDetails}
            className={`px-6 py-2 text-white rounded-md capitalize leading-[1.8] duration-300 hover:scale-95 ${loading ? "opacity-50 cursor-not-allowed" : ""
              } ${generatedDetails ? "bg-green-500" : "bg-primary-1"}}`}
            style={backgroundGardient}
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : "Generate"}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Main;
