import { Stack, Typography } from "@mui/material";
import { Button, Icon, Modal, TextField, Toast } from "@shopify/polaris";
import { AlertCircleIcon, DeleteIcon, PlusIcon } from "@shopify/polaris-icons";
import {
  Field,
  FieldArray,
  FieldProps,
  FormikProvider,
  useFormik,
} from "formik";
import React, { useCallback, useState } from "react";
import * as Yup from "yup";
import { TextFieldStyled } from "../custom/StyleComponent";
import { Product } from "../types/product-manager.type";

interface AddRuleModalProps {
  isRuleModalActive: boolean;
  toggleRuleModal: () => void;
  selectedProduct: Product;
}

const AddRuleModal: React.FC<AddRuleModalProps> = ({
  isRuleModalActive,
  toggleRuleModal,
  selectedProduct,
}) => {
  const [active, setActive] = useState(false);
  const toggleActive = useCallback(() => setActive((active) => !active), []);
  const toastMarkup = active ? (
    <Toast
      content="Add Rule Product Success"
      tone="magic"
      onDismiss={toggleActive}
    />
  ) : null;
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
          .positive("Discount must be a positive number")
          .max(1, "Discount must be less than or equal to 100%"),
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
      open={isRuleModalActive}
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
          <Stack
            direction="row"
            alignItems="flex-start"
            className="w-[91%]"
            gap={1}
            mb={2}
          >
            <div className="!w-1/3">
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
            </div>
            <div className="!w-1/3">
              {/* Start Date using MUI TextField type="date" */}
              <Field name="startDate">
                {({ field, meta }: FieldProps) => (
                  <>
                    <Typography>Start Date</Typography>
                    <TextFieldStyled
                      type="date"
                      {...field}
                      value={formik.values.startDate}
                      onChange={(event) =>
                        formik.setFieldValue("startDate", event.target.value)
                      }
                      error={Boolean(meta.touched && meta.error)}
                      helperText={
                        meta.touched &&
                        meta.error && (
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            className="!w-full"
                            gap={1}
                          >
                            <div>
                              <Icon
                                source={AlertCircleIcon}
                                tone="textCritical"
                              />
                            </div>
                            <div className="text-[#8E0B21] text-sm font-semibold">
                              {meta.touched && meta.error}
                            </div>
                          </Stack>
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </>
                )}
              </Field>
            </div>
            <div className="!w-1/3">
              {/* End Date using MUI TextField type="date" */}
              <Field name="endDate">
                {({ field, meta }: FieldProps) => (
                  <>
                    <Typography className="text-sm !font-inter">
                      End Date
                    </Typography>
                    <TextFieldStyled
                      type="date"
                      {...field}
                      value={formik.values.endDate}
                      onChange={(event) => {
                        console.log(event.target.value);
                        formik.setFieldValue("endDate", event.target.value);
                      }}
                      error={Boolean(meta.touched && meta.error)}
                      helperText={
                        meta.touched &&
                        meta.error && (
                          <Stack
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                            className="!w-full"
                            gap={1}
                          >
                            <div>
                              <Icon
                                source={AlertCircleIcon}
                                tone="textCritical"
                              />
                            </div>
                            <div className="text-[#8E0B21] text-sm font-semibold">
                              {meta.touched && meta.error}
                            </div>
                          </Stack>
                        )
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </>
                )}
              </Field>
            </div>
          </Stack>
          {/* Title, Start Date, and End Date Fields */}

          {/* Dynamic Rule Form */}
          <FieldArray name="rules">
            {({ push, remove }) => (
              <Stack direction="column">
                {formik.values.rules.map((_, index) => (
                  <div key={index} className="rule-item">
                    <div className="rule-inputs flex flex-row gap-2 items-start justify-center">
                      <div className="!w-1/3">
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
                                  Number(value)
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
                      </div>
                      <div className="!w-1/3">
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
                                  Number(value)
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
                      </div>
                      <div className="!w-1/3">
                        <Field name={`rules.${index}.discount`}>
                          {({ field, meta }: FieldProps) => (
                            <TextField
                              label="Discount per item (%)"
                              type="number"
                              {...field}
                              value={
                                (
                                  Number(formik.values.rules[index].discount) *
                                  100
                                ).toString() || ""
                              }
                              onChange={(value) => {
                                const numericValue = parseFloat(value) || 0;
                                formik.setFieldValue(
                                  `rules.${index}.discount`,
                                  numericValue / 100
                                );
                              }}
                              error={
                                meta.touched && meta.error
                                  ? String(meta.error)
                                  : undefined
                              }
                              autoComplete="off"
                            />
                          )}
                        </Field>
                      </div>
                      {/* Remove Rule Button */}
                      <div className="my-6 ml-2">
                        <Button
                          icon={DeleteIcon}
                          onClick={() => remove(index)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {/* Add New Rule Button, disable click if not error fields rules */}
                <Button
                  icon={PlusIcon}
                  onClick={() => push({ buyFrom: "", buyTo: "", discount: "" })}
                  disabled={
                    !!(formik.errors.rules && formik.errors.rules?.length > 0)
                  }
                >
                  Add
                </Button>
              </Stack>
            )}
          </FieldArray>
        </FormikProvider>
        {toastMarkup}
      </Modal.Section>
    </Modal>
  );
};

export default AddRuleModal;
