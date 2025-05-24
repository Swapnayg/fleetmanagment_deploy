//import AddPartiesForm from "./child/AddPartiesForm";
import InputFormWithIcons from "./child/InputFormWithIcons";
import HorizontalInputForm from "./child/HorizontalInputForm";
import HorizontalInputFormWithIcons from "./child/HorizontalInputFormWithIcons";
import InvenDashboardLists from "./child/InvenDashboardLists";

const FormInvDashboard = () => {

  return (
    <div className="row gy-4">
      {/* VerticalInputForm */}
      {/* <AddPartiesForm /> */}
      <InvenDashboardLists />

      {/* InputFormWithIcons */}
      {/* <InputFormWithIcons /> */}

      {/* HorizontalInputForm */}
      {/* <HorizontalInputForm /> */}

      {/* HorizontalInputFormWithIcons */}
      {/* <HorizontalInputFormWithIcons /> */}
    </div>
  );
};

export default FormInvDashboard;
