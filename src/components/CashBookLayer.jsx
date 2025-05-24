import React from "react";
import CashBookDataTable from "./child/CashBookDataTable";

const WizardLayer = () => {
  return (
    <div className="row gy-4">
      {/* NumberingWizard */}
      <CashBookDataTable />

      {/* NumberingWizardWithLabel */}
      {/* <NumberingWizardWithLabel /> */}

      {/* OrderByFollowingStep */}
      {/* <OrderByFollowingStep /> */}

      {/* WizardWithBesideLabel */}
      {/* <WizardWithBesideLabel /> */}
    </div>
  );
};

export default WizardLayer;
