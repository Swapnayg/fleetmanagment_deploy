import React from "react";
import PartyGoodsLists from "./child/PartyGoodsLists";

const PartyGoodsLayer = () => {
  return (
    <div className="row gy-4">
      {/* NumberingWizard */}
      <PartyGoodsLists />

      {/* NumberingWizardWithLabel */}
      {/* <NumberingWizardWithLabel /> */}

      {/* OrderByFollowingStep */}
      {/* <OrderByFollowingStep /> */}

      {/* WizardWithBesideLabel */}
      {/* <WizardWithBesideLabel /> */}
    </div>
  );
};

export default PartyGoodsLayer;
