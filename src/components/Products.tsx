import { Stack } from "@mui/material";
import {
  Button,
  Card,
  DropZone,
  Icon,
  IndexTable,
  Modal,
  Select,
  TextField,
  Toast,
} from "@shopify/polaris";
import {
  AlertCircleIcon,
  PlusIcon,
  SearchIcon,
  XIcon,
} from "@shopify/polaris-icons";
import { Field, FieldProps, FormikProvider, useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import ChipStatus from "../custom/ChipStatus";
import PaginationCustome from "../custom/PaginationCustome";
import {
  FormCreateProduct,
  IResponseDataPost,
  Product,
} from "../types/product-manager.type";
import { paginationOptions, statusOptions } from "../common/ComonProduct";

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalActive, setIsModalActive] = useState<boolean>(false);
  const [isRuleModalActive, setIsRuleModalActive] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(5);
  const [active, setActive] = useState(false);
  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];
  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((res) => res.json())
      .then((data) => {
        const formattedData: Product[] = data.map(
          (product: IResponseDataPost) => ({
            id: product.id,
            image: `https://via.placeholder.com/50`,
            title: product.title,
            rules: Math.floor(Math.random() * 3),
            lastUpdate: "08-12-2023 15:52:18",
          })
        );
        setProducts(formattedData);
        setFilteredProducts(formattedData);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (filterStatus === "" ||
          (Number(product.rules) > 0 ? "Active" : "No rule") === filterStatus)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchQuery, filterStatus, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const resourceName = {
    singular: "product",
    plural: "products",
  };

  const toggleModal = () => setIsModalActive(!isModalActive);

  const toggleRuleModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    setIsRuleModalActive(!isRuleModalActive);
  };
  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast
      content="Add Product Success"
      tone="magic"
      onDismiss={toggleActive}
    />
  ) : null;
  const formik = useFormik<FormCreateProduct>({
    initialValues: {
      title: "",
      price: "",
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
      formik.resetForm();
      toggleModal();
    },
  });

  // Xử lý khi chọn file ảnh
  const handleDropZoneDrop = (_dropFiles: File[], acceptedFiles: File[]) =>
    formik.setFieldValue("imageFile", acceptedFiles[0]);
  return (
    <div className="text-2xl px-9 font-bold">
      <div className=" mb-8 flex justify-between items-center">
        <div className="text-2xl font-bold">Products</div>
        <Button onClick={toggleModal}>Add Product</Button>
      </div>
      <div>
        {/* Search title and Filter Section */}
        <div className="flex gap-4 mb-6">
          <TextField
            label="Search title"
            value={searchQuery}
            onChange={(value) => setSearchQuery(value)}
            prefix={<Icon source={SearchIcon} />}
            autoComplete="off"
          />
          <Select
            label="Filter by status"
            options={statusOptions}
            onChange={setFilterStatus}
            value={filterStatus}
          />
        </div>

        {/* Toast */}
        {toastMarkup}

        {/* Product Table */}
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="overflow-hidden">
            <Card>
              <IndexTable
                resourceName={resourceName}
                itemCount={filteredProducts.length}
                headings={[
                  { title: "Image" },
                  { title: "Product" },
                  { title: "Rules(s)" },
                  { title: "Last Update" },
                  { title: "Status" },
                  { title: "Action" },
                ]}
              >
                {currentItems.map((product, index) => (
                  <IndexTable.Row
                    id={product.id.toString()}
                    key={product.id}
                    position={index}
                  >
                    <IndexTable.Cell>
                      <img src={product.image} alt={product.title} />
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <span className="text-sm font-medium">
                        {product.title}
                      </span>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <span className="text-sm font-normal">
                        {product.rules}
                      </span>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <span className="text-sm font-normal">
                        {product.lastUpdate}
                      </span>
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <ChipStatus
                        label={Number(product.rules) > 0 ? "Active" : "No rule"}
                        rule={Number(product.rules) > 0 ? "Active" : "No rule"}
                      />
                    </IndexTable.Cell>
                    <IndexTable.Cell>
                      <Button
                        icon={PlusIcon}
                        onClick={() => toggleRuleModal(product)}
                      >
                        Add Rule
                      </Button>
                    </IndexTable.Cell>
                  </IndexTable.Row>
                ))}
              </IndexTable>
              <PaginationCustome
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                filteredProducts={filteredProducts}
                setItemsPerPage={setItemsPerPage}
                setCurrentPage={setCurrentPage}
                paginationOptions={paginationOptions}
              />
            </Card>
          </div>
        )}

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
                      value={formik.values.price}
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
                    <>
                      <DropZone.FileUpload actionHint="Accepts .gif, .jpg, and .png" />
                    </>
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

        <Modal
          open={isRuleModalActive}
          onClose={() => toggleRuleModal(null)}
          title={`Add rule`}
        >
          <Modal.Section>
            {selectedProduct ? (
              <div>
                <p>Status: {selectedProduct.rules}</p>
              </div>
            ) : (
              <p>No product selected.</p>
            )}
          </Modal.Section>
        </Modal>
      </div>
    </div>
  );
};

export default Products;
