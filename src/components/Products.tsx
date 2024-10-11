import {
  Button,
  Card,
  Icon,
  IndexTable,
  Modal,
  Select,
  TextField,
  Toast,
} from "@shopify/polaris";
import { PlusIcon, SearchIcon } from "@shopify/polaris-icons";
import React, { useCallback, useEffect, useState } from "react";
import { paginationOptions, statusOptions } from "../common/ComonProduct";
import ChipStatus from "../custom/ChipStatus";
import PaginationCustome from "../custom/PaginationCustome";
import { IResponseDataPost, Product } from "../types/product-manager.type";
import AddNewProductModal from "./AddNewProductModal";
import AddRuleModal from "./AddRuleForm";

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
  const [titleToast, setTitleToast] = useState<string>("");
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
    <Toast content={titleToast} tone="magic" onDismiss={toggleActive} />
  ) : null;

  return (
    <div className="text-2xl px-9 font-bold">
      <div className=" mb-8 flex justify-between items-center">
        <div className="text-2xl font-bold">Products</div>
        <Button icon={PlusIcon} onClick={toggleModal}>
          Add Product
        </Button>
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
        {/* Add New Product Modal */}
        <AddNewProductModal
          isModalActive={isModalActive}
          toggleModal={toggleModal}
          toggleActive={toggleActive}
          setTitleToast={setTitleToast}
        />
        {selectedProduct && (
          <AddRuleModal
            isRuleModalActive={isRuleModalActive}
            toggleRuleModal={toggleRuleModal}
            toggleActive={toggleActive}
            selectedProduct={selectedProduct}
            setTitleToast={setTitleToast}
          />
        )}
        {/* Add Rule Product Modal */}
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
