//import AddPartiesForm from "./child/AddPartiesForm";
import InputFormWithIcons from "./child/InputFormWithIcons";
import HorizontalInputForm from "./child/HorizontalInputForm";
import HorizontalInputFormWithIcons from "./child/HorizontalInputFormWithIcons";
import WarehousesList from "./child/WarehousesList";

const FormLayoutLayer = () => {

  return (
    <div className="row gy-4">
      {/* VerticalInputForm */}
      {/* <AddPartiesForm /> */}
      <WarehousesList />

      {/* InputFormWithIcons */}
      {/* <InputFormWithIcons /> */}

      {/* HorizontalInputForm */}
      {/* <HorizontalInputForm /> */}

      {/* HorizontalInputFormWithIcons */}
      {/* <HorizontalInputFormWithIcons /> */}
    </div>
  );
};

export default FormLayoutLayer;
