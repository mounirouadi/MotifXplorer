import { useEffect, useRef, useState } from "react";
import { useDnaContext } from "../contexts/DnaContext";
import { toast } from "react-hot-toast";

const FileUpload = () => {
  const [isDragged, setIsDragged] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const [isDraggedNegative, setIsDraggedNegative] = useState(false);
  const [fileInfoNegative, setFileInfoNegative] = useState(null);

  const { maxFileSize, fileCount, setUploadedFiles, uploadedFiles, csv, bedFile } =
    useDnaContext();

  const backgroundGardient = {
    backgroundImage:
      "linear-gradient(to right, var(--primary-1), var(--primary-2))",
  };
  const fileInput = useRef(null);
  const fileInputNegative = useRef(null);

  const handleFileInputClick = () => {
    if (csv) return;
    fileInput.current.click();
  };

  const handleFileInputClickNegative = () => {
    if (csv) return;
    fileInputNegative.current.click();
  };

  const handleFileRead = (files, isNegative = false) => {
    if (csv) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedFiles((prevFiles) => {
          const newFiles = [...(prevFiles || [])];
          if (isNegative) {
            newFiles[1] = e.target.result;
          } else {
            newFiles[0] = e.target.result;
          }
          return newFiles;
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (event, isNegative = false) => {
    if (csv) return;
    event.preventDefault();
    const { files } = event.dataTransfer;
    if (isNegative) {
      setFileInfoNegative(files[0]);
    } else {
      setFileInfo(files[0]);
    }
    handleFileRead(files, isNegative);
  };

  const handleChange = (event, isNegative = false) => {
    if (csv) return;
    const selectedFiles = event.target.files;
    if (isNegative) {
      setFileInfoNegative(selectedFiles[0]);
    } else {
      setFileInfo(selectedFiles[0]);
    }
    handleFileRead(selectedFiles, isNegative);
  };

  const handleDragOver = (event, isNegative = false) => {
    event.preventDefault();
    if (csv) return;
    if (isNegative) {
      setIsDraggedNegative(true);
    } else {
      setIsDragged(true);
    }
  };

  const handleDragEnd = (event, isNegative = false) => {
    event.preventDefault();
    if (csv) return;
    if (isNegative) {
      setIsDraggedNegative(false);
    } else {
      setIsDragged(false);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    try {
      // Extract the base64 data from the data URL
      const base64Data = csv.file.split(',')[1];
      // Convert base64 to blob
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: 'text/csv;charset=utf-8' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = csv.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };

  const SelectedFile = ({ isNegative = false }) => {
    const info = isNegative ? fileInfoNegative : fileInfo;
    return (
      <>
        <div className="relative">
          <i className="fa-solid fa-dna text-[50px] text-blue-400 absolute -right-4 -bottom-2 z-0"></i>
          <i className="fa-solid fa-file text-[150px] text-gray-500 z-50"></i>
        </div>
        {csv ? (
          <button
            className={`px-6 py-2 text-white rounded-md`}
            onClick={handleDownload}
            style={{
              backgroundColor: "var(--primary-2)",
              ...backgroundGardient,
            }}
          >Download Csv</button>
        ) : (
          <p className="w-[275px] text-center truncate font-medium text-xl">
            {isNegative ? "Negative" : "Positive"} File Uploaded
          </p>
        )}
        {!csv && (
          <p className="text-gray-600 -mt-2 max-w-[85%] text-center">
            You can click or drop another file
          </p>
        )}
      </>
    );
  };

  const UploadFile = ({ isNegative = false }) => {
    const isDraggedState = isNegative ? isDraggedNegative : isDragged;
    return (
      <>
        <div className="drag-drop flex items-center flex-col gap-2">
          <i
            className={`fa-solid fa-cloud-arrow-up text-5xl duration-300 ${
              isDraggedState ? "text-green-500" : "text-gray-500"
            }`}
          ></i>
          <p
            className={`text-gray-500 duration-300 ${
              isDraggedState ? "text-green-500" : "text-gray-500"
            }`}
          >
            Upload {isNegative ? "Negative" : "Positive"} ChIP-seq peaks
          </p>
        </div>
        <div className="border-t border-b w-20 text-center">or</div>
        <div>
          <button
            className={`py-2 px-5 rounded text-white ${
              csv ? "cursor-not-allowed" : "cursor-pointer"
            }
            `}
            style={{
              backgroundColor: "var(--primary-2)",
              ...backgroundGardient,
            }}
          >
            Browse files
          </button>
        </div>
        <p className="text-gray-500 mt-4">
          maximum file size is {maxFileSize}MB
        </p>
      </>
    );
  };

  const UploadContainer = ({ isNegative = false }) => (
    <div
      className={`flex items-center justify-center duration-300 flex-col gap-4 border-dashed ${
        isNegative ? isDraggedNegative : isDragged ? "border-green-500" : "border-slate-400"
      } ${
        csv ? "cursor-not-allowed" : "cursor-pointer"
      } border-2 rounded-lg w-[100%] h-[325px] md:w-[280px] bg-white`}
      onClick={isNegative ? handleFileInputClickNegative : handleFileInputClick}
      onDrop={(e) => handleDrop(e, isNegative)}
      onDragOver={(e) => handleDragOver(e, isNegative)}
      onDragLeave={(e) => handleDragEnd(e, isNegative)}
    >
      <input
        type="file"
        ref={isNegative ? fileInputNegative : fileInput}
        multiple={false}
        style={{ display: "none" }}
        onChange={(e) => handleChange(e, isNegative)}
      />

      {(isNegative ? fileInfoNegative : fileInfo) || csv ? (
        <SelectedFile isNegative={isNegative} />
      ) : (
        <UploadFile isNegative={isNegative} />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-row items-center justify-center gap-8">
          <div className="w-full flex flex-col items-center">
            <UploadContainer />
          </div>
          {bedFile === 2 && !csv && (
            <div className="w-full flex flex-col items-center">
              <UploadContainer isNegative={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
