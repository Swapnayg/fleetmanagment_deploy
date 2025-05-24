import Breadcrumb from "@/components/Breadcrumb";
import NewPartyGoodsLayer from "@/components/NewPartyGoodsLayer";
import MasterLayout from "@/masterLayout/MasterLayout";
//import PartyLedgerTemplate from "@/components/child/PartyLedgerTemplate";

export const metadata = {
  title: "New Party Goods",
  description:
    "New Party Goods.",
};

const Page = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>
        {/* Breadcrumb */}
        <Breadcrumb title="Wizard" />

        {/* WizardLayer */}
        <NewPartyGoodsLayer />
        {/* <PartyLedgerTemplate /> */}
      </MasterLayout>
    </>
  );
};

export default Page;
