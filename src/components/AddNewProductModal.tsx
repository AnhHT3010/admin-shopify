import { Stack } from "@mui/material";
import { DropZone, Icon, Modal, TextField } from "@shopify/polaris";
import { AlertCircleIcon, XIcon } from "@shopify/polaris-icons";
import { Field, FieldProps, FormikProvider, useFormik } from "formik";
import React from "react";
import * as Yup from "yup";
import { FormCreateProduct } from "../types/product-manager.type";

interface AddNewProductModalProps {
  isModalActive: boolean;
  toggleModal: () => void;
  setTitleToast: (value: string) => void;
  toggleActive: () => void;
}

const AddNewProductModal: React.FC<AddNewProductModalProps> = ({
  isModalActive,
  toggleModal,
  setTitleToast,
  toggleActive,
}) => {
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  const formik = useFormik<FormCreateProduct>({
    initialValues: {
      title: "",
      price: 0,
      description: "",
      imageFile: null,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be positive")
        .required("Price is required"),
      description: Yup.string().required("Description is required"),
      imageFile: Yup.mixed()
        .required("Image is required")
        .test(
          "fileType",
          "Unsupported file type. Only jpeg, png, gif are allowed.",
          (value: unknown) => {
            if (value instanceof File) {
              return validImageTypes.includes(value.type);
            }
            return false;
          }
        ),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
      toggleActive();
      setTitleToast("Add Product Success");
      formik.resetForm();
      toggleModal();
    },
  });

  /*  Handle When Upload Img */
  const handleDropZoneDrop = (acceptedFiles: File[]) =>
    formik.setFieldValue("imageFile", acceptedFiles[0]);

  return (
    <Modal
      open={isModalActive}
      onClose={toggleModal}
      title="Add New Product"
      primaryAction={{
        content: "Save",
        onAction: formik.handleSubmit,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: toggleModal,
        },
      ]}
    >
      <Modal.Section>
        <FormikProvider value={formik}>
          <Stack direction="column" gap={2}>
            {/* Title Field */}
            <Field name="title">
              {({ field }: FieldProps) => (
                <TextField
                  label="Title"
                  {...field}
                  error={formik.touched.title && formik.errors.title}
                  value={formik.values.title}
                  onChange={(value) => formik.setFieldValue("title", value)}
                  multiline={1}
                  autoComplete="off"
                />
              )}
            </Field>

            {/* Price Field */}
            <Field name="price">
              {({ field }: FieldProps) => (
                <TextField
                  label="Price"
                  type="number"
                  {...field}
                  value={formik.values.price.toString()}
                  error={formik.touched.price && formik.errors.price}
                  onChange={(value) => formik.setFieldValue("price", value)}
                  autoComplete="off"
                />
              )}
            </Field>

            {/* DropZone for Image Upload */}
            <DropZone
              label="Image"
              accept="image/*"
              type="image"
              onDrop={handleDropZoneDrop}
            >
              {formik.values.imageFile &&
              validImageTypes.includes(formik.values.imageFile.type) ? (
                <div className="relative w-full h-80">
                  <img
                    alt="Upload preview"
                    src={URL.createObjectURL(formik.values.imageFile)}
                    className="w-full h-full object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => formik.setFieldValue("imageFile", null)}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:opacity-90"
                  >
                    <Icon source={XIcon} />
                  </button>
                </div>
              ) : (
                <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />
              )}
            </DropZone>

            {/* Error Handling */}
            {formik.touched.imageFile && formik.errors.imageFile && (
              <Stack
                direction="row"
                justifyContent="flex-start"
                alignItems="center"
                gap={1}
                className="!mt-[-12px]"
              >
                <div>
                  <Icon source={AlertCircleIcon} tone="textCritical" />
                </div>
                <div className="text-[#8E0B21] text-base font-semibold">
                  {formik.errors.imageFile}
                </div>
              </Stack>
            )}

            {/* Description Field */}
            <Field name="description">
              {({ field }: FieldProps) => (
                <TextField
                  label="Description"
                  {...field}
                  error={
                    formik.touched.description && formik.errors.description
                  }
                  value={formik.values.description}
                  onChange={(value) =>
                    formik.setFieldValue("description", value)
                  }
                  multiline={4}
                  autoComplete="off"
                />
              )}
            </Field>
          </Stack>
        </FormikProvider>
      </Modal.Section>
    </Modal>
  );
};

export default AddNewProductModal;
