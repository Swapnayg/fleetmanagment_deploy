import React from "react";
import NewPartyOilsLists from "./child/NewPartyOilsLists";

const NewPartyOilsLayer = () => {
  return (
    <div className="row gy-4">
      {/* NumberingWizard */}
      <NewPartyOilsLists />

      {/* NumberingWizardWithLabel */}
      {/* <NumberingWizardWithLabel /> */}

      {/* OrderByFollowingStep */}
      {/* <OrderByFollowingStep /> */}

      {/* WizardWithBesideLabel */}
      {/* <WizardWithBesideLabel /> */}
    </div>
  );
};

export default NewPartyOilsLayer;
