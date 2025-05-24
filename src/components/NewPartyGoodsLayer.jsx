import React from "react";
import NewPartyGoodsLists from "./child/NewPartyGoodsLists";

const NewPartyGoodsLayer = () => {
  return (
    <div className="row gy-4">
      {/* NumberingWizard */}
      <NewPartyGoodsLists />

      {/* NumberingWizardWithLabel */}
      {/* <NumberingWizardWithLabel /> */}

      {/* OrderByFollowingStep */}
      {/* <OrderByFollowingStep /> */}

      {/* WizardWithBesideLabel */}
      {/* <WizardWithBesideLabel /> */}
    </div>
  );
};

export default NewPartyGoodsLayer;
