import { createContext, useState, useContext, useEffect } from "react";

export const DnaContext = createContext();

export const DnaContextProvider = ({ children }) => {
  const [maxFileSize, setMaxFileSize] = useState(2);
  const [fileCount, setFileCount] = useState(1);
  const [bedFile, setBedFile] = useState(null);
  const [referenceGenome, setReferenceGenome] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState(null);
  const [kmer, setKmer] = useState(null);
  const [csv, setCsv] = useState(null);
  const [images, setImages] = useState({});
  const [rocImages, setRocImages] = useState({});
  const [tree, setTree] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    switch (bedFile) {
      case 1:
        {
          setMaxFileSize(2);
          setFileCount(1);
        }
        break;
      case 2:
        {
          setMaxFileSize(1);
          setFileCount(2);
        }
        break;
      default:
        setMaxFileSize(2);
    }
  }, [bedFile]);

  return (
    <DnaContext.Provider
      value={{
        maxFileSize,
        setMaxFileSize,
        bedFile,
        setBedFile,
        referenceGenome,
        setReferenceGenome,
        uploadedFiles,
        setUploadedFiles,
        fileCount,
        setFileCount,
        loading,
        setLoading,
        kmer,
        setKmer,
        csv,
        setCsv,
        images,
        setImages,
        rocImages,
        setRocImages,
      }}
    >
      {children}
    </DnaContext.Provider>
  );
};

export const useDnaContext = () => {
  return useContext(DnaContext);
};
