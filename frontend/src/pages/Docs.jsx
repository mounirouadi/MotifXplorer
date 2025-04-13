import React from "react";
import YourVideo from "../videos/video.mp4";
import pic from "../static/pic1.png"
import img1 from "../static/img1.PNG"
import img2 from "../static/img2.PNG"
import img3 from "../static/img3.PNG"
import img4 from "../static/img4.PNG"
import img5 from "../static/img5.PNG"

const Docs = () => {
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "0 20px",
  };



  const backgroundGradient = {
    backgroundImage:
      "linear-gradient(to right, var(--primary-1), var(--primary-2))",
  };

  return (
    <div className="container" style={containerStyle}>
       <h1 className="text-3xl text-gray-700 font-semibold text-left mb-3">
        MotifXplorer Documentation
      </h1>
      <p className="max-w-[550px] text-gray-800 text-left">
        Welcome to the documentation page of MotifXplorer.
      </p>
      <h2 className="text-2xl text-gray-700 font-semibold text-left mb-3">
        Description
      </h2>
      <p className="max-w-[550px] text-gray-800 text-left">
        The Genomic Peak Analysis Web Tool is a user-friendly platform designed
        for non-machine learning professionals to analyze ChIP-seq peaks and gain
        insights into DNA sequences associated with those peaks. This web tool
        provides a seamless experience for researchers working with genomic data,
        enabling them to perform XGBoost analysis and discover significant DNA
        sequences.
      </p>
      <img src={pic} alt="MotifXplorer" className="max-w-full mb-4" />
       <h2 className="text-2xl text-gray-700 font-semibold text-left mb-3">
        Features
      </h2>
      <ul className="max-w-[550px] text-gray-800 text-left">
        <li>Genome Selection: Choose from a variety of reference genomes, including hg19, hg38, mm9, and more.</li>
        <li>Positive Case Analysis: Upload a BED file containing ChIP-seq peaks as positive examples for analysis.</li>
        <li>Negative Example Generation: Automatically generate negative examples by randomly selecting genomic regions based on the positive BED file, or allow users to provide their own negative BED file.</li>
        <li>XGBoost Analysis: Perform XGBoost analysis to identify patterns and classify DNA sequences associated with the peaks.</li>
        <li>Top Signature DNA Sequences: Display the top 10 signature DNA sequences learned by the XGBoost model, providing valuable insights into the underlying biology.</li>
        <li>Optional Motif Analysis: Conduct motif analysis to identify enriched transcription factor binding motifs within the identified DNA sequences.</li>
      </ul>
       <h2 className="text-2xl text-gray-700 font-semibold text-left mb-3">
        Documentation
      </h2>
      <p className="max-w-[550px] text-gray-800 text-left">
        <strong>1. Analysis Steps:</strong><br />
        - Select genome (hg19, hg38, mm9, etc).<br />
        - Use a bed file as a positive case input.<br />
        - Either users bring their own negative example bed file or this webtool automatically design negative examples by taking genomic regions randomly based on the positive bed file uploaded to the web platform.<br />
        - Select motif(k-mer) size (from 4 to 10).

        <br /><br />
        <img src={img1} alt="pic1" className="max-w-full mb-4" />
        <img src={img2} alt="pic2" className="max-w-full mb-4" />
        - Get ROC and Confusion matrix as results right away.
        <img src={img3} alt="pic2" className="max-w-full mb-4" />
        <br /><br />
        <strong>2. Feature Importance:</strong><br />
        Weight Importance: It is based on the number of times a feature appears in the trees of the model. The higher the number of times a feature is used to make splits across all trees, the more important it is considered.<br />
        Cover Importance: It is calculated by summing up the average coverage of each feature across all trees. Coverage represents the average number of samples affected by the splits using a particular feature. Features with higher coverage are considered more important.<br />
        Gain Importance: It measures the average gain (or improvement in the model's loss function) obtained from splits on a particular feature. Gain importance provides insights into the contribution of each feature to the model's performance improvement.<br />
        Total Gain Importance: It is similar to gain importance but takes into account the total gain across all splits using a particular feature. Total gain importance provides a cumulative measure of the contribution of a feature to the model.<br />
        Total Cover Importance: Similar to cover importance, total cover importance considers the cumulative coverage across all splits using a feature. It provides an overall measure of the impact of a feature on the model's coverage.

        <br /><br />
        <img src={img4} alt="pic2" className="max-w-full mb-4" />
        <strong>3. Importance Tree:</strong><br />
        In the decision tree generated by XGBoost, the nodes and leaves represent different components and characteristics of the decision-making process. Here's a breakdown of what nodes and leaves typically represent:<br />
        Nodes: Nodes in the decision tree represent decision points or conditions based on features. Each node represents a specific feature and a threshold value that is used to split the data. The decision tree traverses from the root node to the leaf nodes based on the conditions evaluated at each node. Nodes can have child nodes that further divide the data based on different conditions.<br />
        Leaf Nodes: Leaf nodes, also known as terminal nodes, are the endpoints of the decision tree. They do not have any child nodes. Each leaf node represents a class or a predicted outcome. When a sample reaches a leaf node during the prediction process, it is assigned to the class associated with that leaf node.<br />
        In the visualization of the decision tree, nodes are usually represented as boxes or rectangles, while leaf nodes are represented as boxes with rounded corners or simply as rectangles. The visualization provides a graphical representation of the decision process, showing how the features are used to split the data and make predictions.<br />
        By analyzing the decision tree structure, you can gain insights into the decision-making process of the model. It allows you to understand which features are important for classification and how the model partitions the data based on those features to make predictions.
      </p>
      <h2 className="text-2xl text-gray-700 font-semibold text-left mb-3">
      Demonstration Video:
      </h2>
      

      <div className="max-w-[550px] mx-auto mt-6">
        <video width="100%" controls>
          <source src={YourVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

    </div>
  );
};

export default Docs;
