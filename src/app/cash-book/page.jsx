import Breadcrumb from "@/components/Breadcrumb";
import CashBookLayer from "@/components/CashBookLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
//import PartyLedgerTemplate from "@/components/child/PartyLedgerTemplate";

export const metadata = {
  title: "Cashbook",
  description:
    "Cashbook.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Wizard" />

        {/* WizardLayer */}
        <CashBookLayer />
        {/* <PartyLedgerTemplate /> */}
      </MasterLayout>
    </>
  );
};

export default Page;
