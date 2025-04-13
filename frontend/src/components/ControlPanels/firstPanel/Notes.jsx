const Notes = ({ bedFile, maxFileSize }) => {
  switch (bedFile) {
    case 1:
      return (
        <div className="mt-3">
          <p>
            <span className="uppercase font-bold">note:</span>
            <span className="ml-1">
              The file size should be less than {maxFileSize}MB
            </span>
          </p>
        </div>
      );
    case 2:
      return (
        <div className="mt-3">
          <p>
            <span className="uppercase font-bold">note:</span>
            <span className="ml-1">
              The file size should be less than {maxFileSize}MB
            </span>
          </p>
          <p>
            <span className="uppercase font-bold">note:</span>
            <span className="ml-1 max-w-[100%]">
              You must upload two files, for the positive and negative
            </span>
          </p>
        </div>
      );
    default:
      return null;
  }
};

export default Notes;
