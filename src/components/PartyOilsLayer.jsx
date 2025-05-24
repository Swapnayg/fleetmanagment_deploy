import React from "react";
import PartyOilsLists from "./child/PartyOilsLists";

const PartyOilsLayer = () => {
  return (
    <div className="row gy-4">
      {/* NumberingWizard */}
      <PartyOilsLists />

      {/* NumberingWizardWithLabel */}
      {/* <NumberingWizardWithLabel /> */}

      {/* OrderByFollowingStep */}
      {/* <OrderByFollowingStep /> */}

      {/* WizardWithBesideLabel */}
      {/* <WizardWithBesideLabel /> */}
    </div>
  );
};

export default PartyOilsLayer;
