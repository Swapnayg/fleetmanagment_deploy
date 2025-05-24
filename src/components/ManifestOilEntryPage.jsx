import React from "react";
import ManifestOilEntryForm from "./child/ManifestoilEntryForm";
import InputStatus from "./child/InputStatus";

const FormValidationLayer = () => {
  return (
    <div className="row gy-4">
      {/* InputCustomStyles */}
      <ManifestOilEntryForm />

      {/* InputStatus */}
      {/* <InputStatus /> */}
    </div>
  );
};

export default FormValidationLayer;
