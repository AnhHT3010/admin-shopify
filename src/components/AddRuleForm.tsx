import { Stack } from "@mui/material";
import { Button, Modal, TextField } from "@shopify/polaris";
import { DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import {
  Field,
  FieldArray,
  FieldProps,
  FormikProvider,
  useFormik,
} from "formik";
import React from "react";
import * as Yup from "yup";
import { Product } from "../types/product-manager.type";

interface AddRuleModalProps {
  isRuleModalActive: boolean;
  toggleRuleModal: () => void;
  toggleActive: () => void;
  selectedProduct: Product;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({
  isRuleModalActive,
  toggleRuleModal,
  toggleActive,
  selectedProduct,
}) => {
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .required("End date is required")
      .min(Yup.ref("startDate"), "End date must be after start date"),
    rules: Yup.array().of(
      Yup.object().shape({
        buyFrom: Yup.number().required("Buy from is required").positive(),
        buyTo: Yup.number()
          .required("Buy to is required")
          .moreThan(Yup.ref("buyFrom"), "Buy to must be greater than Buy from"),
        discount: Yup.number()
          .required("Discount is required")
          .positive("Discount must be a positive number"),
      })
    ),
  });

  const formik = useFormik({
    initialValues: {
      title: selectedProduct.title,
      startDate: "",
      endDate: "",
      rules: [{ buyFrom: "", buyTo: "", discount: "" }],
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Form Values:", values);
      toggleActive();
    },
  });

  return (
    <Modal
      open={isRuleModalActive} // Set to true to render the modal for demo purposes
      onClose={toggleRuleModal}
      title="Add Rule"
      primaryAction={{
        content: "Save",
        onAction: formik.handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: toggleRuleModal,
        },
      ]}
    >
      <Modal.Section>
        <FormikProvider value={formik}>
          <Stack direction="row" className="w-full" gap={2} mb={2}>
            <Field name="title">
              {({ field }: FieldProps) => (
                <TextField
                  label="Title Campaign"
                  {...field}
                  value={formik.values.title}
                  onChange={(value) => formik.setFieldValue("title", value)}
                  error={formik.touched.title && formik.errors.title}
                  multiline={false}
                  autoComplete="off"
                />
              )}
            </Field>
            <Field name="startDate">
              {({ field }: FieldProps) => (
                <TextField
                  label="Start Date"
                  {...field}
                  type="date"
                  value={formik.values.startDate}
                  onChange={(value) => formik.setFieldValue("startDate", value)}
                  error={formik.touched.startDate && formik.errors.startDate}
                  multiline={1}
                  autoComplete="off"
                />
              )}
            </Field>
            <Field name="endDate">
              {({ field }: FieldProps) => (
                <TextField
                  label="End Date"
                  {...field}
                  type="date"
                  value={formik.values.endDate}
                  onChange={(value) => formik.setFieldValue("endDate", value)}
                  error={formik.touched.endDate && formik.errors.endDate}
                  multiline={1}
                  autoComplete="off"
                />
              )}
            </Field>
          </Stack>
          {/* Title, Start Date, and End Date Fields */}

          {/* Dynamic Rule Form */}
          <FieldArray name="rules">
            {({ push, remove }) => (
              <Stack direction="column" gap={2}>
                {formik.values.rules.map((rule, index) => (
                  <div key={index} className="rule-item">
                    <div className="rule-inputs flex flex-row gap-2 items-end justify-center">
                      <Field name={`rules.${index}.buyFrom`}>
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            label="Buy from"
                            type="number"
                            {...field}
                            value={formik.values.rules[index].buyFrom}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `rules.${index}.buyFrom`,
                                value
                              )
                            }
                            error={
                              meta.touched && meta.error
                                ? String(meta.error)
                                : undefined
                            }
                            autoComplete="off"
                          />
                        )}
                      </Field>
                      <Field name={`rules.${index}.buyTo`}>
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            label="Buy to"
                            type="number"
                            {...field}
                            value={formik.values.rules[index].buyTo}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `rules.${index}.buyTo`,
                                value
                              )
                            }
                            error={
                              meta.touched && meta.error
                                ? String(meta.error)
                                : undefined
                            }
                            autoComplete="off"
                          />
                        )}
                      </Field>
                      <Field name={`rules.${index}.discount`}>
                        {({ field, meta }: FieldProps) => (
                          <TextField
                            label="Discount per item (%)"
                            type="number"
                            {...field}
                            value={formik.values.rules[index].discount}
                            onChange={(value) =>
                              formik.setFieldValue(
                                `rules.${index}.discount`,
                                value
                              )
                            }
                            error={
                              meta.touched && meta.error
                                ? String(meta.error)
                                : undefined
                            }
                            autoComplete="off"
                          />
                        )}
                      </Field>
                      {/* Remove Rule Button */}
                      <Button icon={DeleteIcon} onClick={() => remove(index)} />
                    </div>
                  </div>
                ))}
                {/* Add New Rule Button */}
                <Button
                  icon={PlusIcon}
                  onClick={() => push({ buyFrom: "", buyTo: "", discount: "" })}
                >
                  Add
                </Button>
              </Stack>
            )}
          </FieldArray>
        </FormikProvider>
      </Modal.Section>
    </Modal>
  );
};

export default AddRuleModal;
