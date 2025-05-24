import React from "react";
import ManifestEntryForm from "./child/ManifestEntryForm";
import InputStatus from "./child/InputStatus";

const FormValidationLayer = () => {
  return (
    <div className="row gy-4">
      {/* InputCustomStyles */}
      <ManifestEntryForm />

      {/* InputStatus */}
      {/* <InputStatus /> */}
    </div>
  );
};

export default FormValidationLayer;
